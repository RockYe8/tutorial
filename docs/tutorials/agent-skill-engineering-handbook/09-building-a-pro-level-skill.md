# 第九章 从零构建一个 Pro-Level Skill：完整案例与决策过程

## 本章证据底座

本章主要综合 Agent Skills specification、Claude Code Skills / Plugins、OpenAI Skills / Plugins、Microsoft Agent Framework、AWS AgentCore、Alibaba Model Studio、Tencent ADP、xAI Grok、Apple Foundation Models / App Intents 等官方或一手资料，把前八章的方法论收束成一个无业务痕迹的构建案例。[Agent Skills Spec][agent-skills-spec][Claude Code Skills][claude-code-skills][Claude Code Plugins][claude-code-plugins][OpenAI Skills][openai-skills][OpenAI Plugins][openai-plugins][Microsoft Agent Skills][ms-agent-skills]

本章不会一上来展示完整 bundle。官方资料共同指向的路径是：先有最小 `SKILL.md`，再按需要增加 references、assets、scripts、evals、工具边界、发布和维护机制；self-contained bundle 是分发和治理需求出现后的形态，不是所有 Skill 的默认起点。[Agent Skills Spec][agent-skills-spec][Claude Code Skills][claude-code-skills][Claude Code Plugins][claude-code-plugins][OpenAI Plugins][openai-plugins]

## 9.1 案例目标：先定义 capability boundary

本章选择一个通用能力作为案例：`cited-tutorial-writer`。它的目标是帮助 agent 基于已有研究笔记撰写带引用的教程章节，要求正文关键观点有引用标注，章末集中列出 Sources。

它适合做成 Skill，因为核心问题是 teach the agent how to perform a repeatable task：如何判断输入是否足够、如何写章节结构、如何引用来源、如何验证引用完整性。Agent Skills spec、OpenAI Skills 和 Microsoft Agent Framework 都把 Skill 描述为可复用 instructions / resources / scripts package，而不是单次 prompt。[Agent Skills Spec][agent-skills-spec][OpenAI Skills][openai-skills][Microsoft Agent Skills][ms-agent-skills]

它一开始不适合做成 tool，因为我们还没有稳定 API schema，也没有外部系统动作；它一开始不适合做成 workflow，因为步骤虽然有顺序，但仍需要写作判断；它也不需要一开始做成 plugin，因为还没有跨 workspace 分发、权限继承或 marketplace 安装需求。[Microsoft Adding Skills][ms-adding-skills][Microsoft Workflows][ms-workflows][OpenAI Plugins][openai-plugins]

本阶段的决策是：

```text
Use a Skill, not a tool, workflow, connector, or plugin.
```

## 9.2 V0：最小 `SKILL.md`

V0 的目标不是“完整”，而是让 agent 能被正确触发，并按最小流程交付可用结果。Agent Skills spec 要求 portable skill 至少有 `SKILL.md`，并通过 `name` 和 `description` 提供发现入口；Claude Code 也展示了只含 `SKILL.md` 的本地 skill 起点。[Agent Skills Spec][agent-skills-spec][Claude Code Skills][claude-code-skills]

V0 目录可以只有：

```text
cited-tutorial-writer/
  SKILL.md
```

V0 的 `SKILL.md` 可以这样设计：

```markdown
---
name: cited-tutorial-writer
description: Use when the user asks to draft or revise a tutorial chapter from research notes and requires cited key claims plus a chapter-level Sources section. Do not use for quick uncited brainstorming or ordinary chat replies.
---

# Cited Tutorial Writer

Use this skill after activation to draft or revise a tutorial chapter from provided research notes.

## Workflow

1. Confirm the chapter topic and available research notes.
2. Identify the chapter's role relative to prior chapters.
3. Draft the chapter in tutorial style.
4. Add citation markers after key claims.
5. Add a `## Sources` section with full Markdown reference links.
6. Before finalizing, check that every citation marker has a source definition.

## Ask When

- The user asks for citations but provides no research notes or source list.
- The chapter depends on current facts that need fresh official sources.

## Operational Boundaries

- Continue only when research notes or source links are available.
- Ask when the user requests cited claims but provides no usable evidence base.
- Do not invent source links, treat tutorial synthesis as a vendor-standard term, or turn the chapter into a vendor comparison table unless the user asks for one.
```

V0 已经体现了前两章的原则：`description` 是 activation contract，正文是 activated agent 的 operating procedure。[Agent Skills Spec][agent-skills-spec][Anthropic Best Practices][anthropic-best-practices]

## 9.3 V1：Progressive Disclosure

V0 能工作，但很快会遇到问题：引用格式规范、章节风格、术语表、source policy 都不应该全部塞进 `SKILL.md`。Anthropic best practices 和 Agent Skills spec 都建议把较长内容拆到 referenced files，让 `SKILL.md` 保持 lean。[Anthropic Best Practices][anthropic-best-practices][Agent Skills Spec][agent-skills-spec]

V1 增加 `references/` 和 `assets/`：

```text
cited-tutorial-writer/
  SKILL.md
  references/
    citation-policy.md
    chapter-style.md
    terminology.md
  assets/
    chapter-template.md
```

此时 `SKILL.md` 不复制这些文件内容，只做 routing：

```markdown
## Resources

| Need | Use |
| --- | --- |
| Citation rules and source labels | Read [references/citation-policy.md](references/citation-policy.md) |
| Chapter voice, pacing, and structure | Read [references/chapter-style.md](references/chapter-style.md) |
| Shared terms and forbidden claims | Read [references/terminology.md](references/terminology.md) |
| Starting a new chapter draft | Use [assets/chapter-template.md](assets/chapter-template.md) |
```

这个升级的理由不是“目录更漂亮”，而是降低上下文成本，并让 agent 只在需要时读取细节。Microsoft Agent Framework 的 load / read resources / run scripts 模型也体现了同样的 progressive disclosure 思路。[Microsoft Agent Skills][ms-agent-skills]

## 9.4 V2：加入 deterministic helpers

当引用标记和 source definitions 需要稳定检查时，用自然语言提醒不够可靠。此时可以加一个本地 validator script。Agent Skills spec 允许 `scripts/` 包含 executable code，并建议脚本自包含、说明依赖、给出友好错误；Anthropic 也建议把更适合传统代码的确定性操作放进 utility scripts。[Agent Skills Spec][agent-skills-spec][Anthropic Agent Skills][anthropic-agent-skills]

V2 目录：

```text
cited-tutorial-writer/
  SKILL.md
  references/
    citation-policy.md
    chapter-style.md
    terminology.md
  assets/
    chapter-template.md
  scripts/
    validate-citations.py
```

`SKILL.md` 需要明确脚本是执行用，不是参考用：

```markdown
## Scripts

- Run `scripts/validate-citations.py <chapter.md>` before finalizing.
- The script checks citation markers, source definitions, and unused sources.
- If validation fails, revise the chapter and rerun the script once.
- Do not edit this script during normal skill use.
```

这个阶段仍然不需要 tool / MCP。脚本是本 Skill 内部的确定性 helper，不是多个 agents 共享的稳定 callable interface。[Microsoft Agent Skills][ms-agent-skills][Microsoft Function Tools][ms-function-tools]

## 9.5 V3：加入 evals 和质量门槛

一旦这个 Skill 要被复用，就不能只靠人工感觉。Agent Skills evaluation guidance 建议用 fresh context、with-skill / without-skill baseline、fixtures、grading 和 human feedback；OpenAI evals、Microsoft evaluation、AWS Evaluations 和 Apple tool-call evaluation 也都强调结构化评估、过程评估或轨迹评估。[Agent Skills Evaluation][agent-skills-evaluation][OpenAI Evals][openai-evals][Microsoft Agent Evaluation][ms-agent-evaluation][AWS AgentCore Evaluations][aws-agentcore-evaluations][Apple Tool Call Evaluation][apple-tool-call-evaluation]

V3 增加：

```text
cited-tutorial-writer/
  SKILL.md
  references/
  assets/
  scripts/
  evals/
    activation.json
    behavior.json
    safety.json
    regression.json
```

`activation.json` 测触发：

```json
[
  {
    "id": "draft-cited-chapter",
    "prompt": "Draft a tutorial chapter from these research notes and include clickable citations.",
    "should_trigger": true
  },
  {
    "id": "quick-opinion",
    "prompt": "What do you think about agent skills in two sentences?",
    "should_trigger": false
  }
]
```

`behavior.json` 测正文跟随：

```json
[
  {
    "id": "requires-sources-section",
    "prompt": "Revise this chapter and ensure every key claim has a source.",
    "assertions": [
      "final_output_contains_sources_section",
      "all_reference_markers_have_definitions",
      "no_invented_vendor_standard_terms"
    ]
  }
]
```

V3 的核心变化是：Skill 从“可用”进入“可验证”。第六章的 skill pass 现在可以落地为 activation、body-following、safety、output 和 regression fixtures。[Agent Skills Evaluation][agent-skills-evaluation][Agent Skills Best Practices][agent-skills-best-practices]

## 9.6 V4：识别 external boundary

假设后续用户希望这个 Skill 自动拉取最新官方文档、访问网页、同步到知识库或发布到 workspace。此时不能把外部动作继续藏在 `SKILL.md` 或 local script 里。第五章已经说明，外部动作、认证、授权、审计和跨客户端复用是 tool / MCP / connector / workflow 的信号。[OpenAI API Tools][openai-api-tools][MCP Tools Spec][mcp-tools-spec][AWS AgentCore Gateway][aws-agentcore-gateway][xAI Connectors][xai-connectors]

如果只是本地检查 Markdown，保留 script。  
如果要稳定调用“获取官方文档页面”能力，做成 tool。  
如果要暴露一组可复用 docs lookup tools，考虑 MCP。  
如果要连接 Google Drive、SharePoint、Notion 或企业知识库，使用 connector。  
如果要按固定审批流程发布章节，使用 workflow。

这时 `SKILL.md` 的职责是说明何时使用这些外部能力，而不是自己携带 credentials 或绕过权限。OpenAI plugin security、Microsoft safety 和 xAI connectors 都强调 OAuth、scopes、source-system permissions、approval 和 server-side validation 的重要性。[OpenAI Plugin Security][openai-plugin-security][Microsoft Agent Safety][ms-agent-safety][xAI Connectors][xai-connectors]

## 9.7 V5：升级为 self-contained bundle / plugin

当 `cited-tutorial-writer` 只服务个人，它可以停在 V3 或 V4。如果它要分发给团队，或和多个 skills、connectors、templates、MCP config、hooks、settings 一起安装，就进入 plugin / capability bundle 阶段。OpenAI Plugins 可包含 skills、apps、app templates；Claude Code plugins 可包含 commands、agents、skills、hooks、MCP servers，并通过 marketplaces 进行分发和更新。[OpenAI Plugins][openai-plugins][Claude Code Plugins][claude-code-plugins][Claude Plugin Marketplace][claude-plugin-marketplace]

V5 可能变成：

```text
tutorial-authoring-plugin/
  plugin.json
  skills/
    cited-tutorial-writer/
      SKILL.md
      references/
      assets/
      scripts/
      evals/
  .mcp.json
  settings.json
  CHANGELOG.md
```

这一步只有在分发需求真实存在时才值得。否则，plugin manifest、marketplace、settings、MCP config 都是额外维护面。[OpenAI Plugins][openai-plugins][Claude Code Plugins][claude-code-plugins]

## 9.8 V6：加入 lifecycle metadata

当 Skill 成为共享能力，就需要第八章的 lifecycle 管理：owner、version、scope、review date、source watchlist、rollback、deprecation。[Agent Skills Evaluation][agent-skills-evaluation][OpenAI Skills][openai-skills][Claude Code Plugins][claude-code-plugins]

可以增加：

```yaml
maintenance:
  owner: tutorial-platform
  backup_owner: developer-experience
  version: 1.2.0
  status: active
  distribution_scope: project
  last_reviewed: 2026-08-15
  review_interval_days: 90
  stale_after: 2026-11-13
  rollback_version: 1.1.3
  source_watchlist:
    - https://agentskills.io/specification
    - https://code.claude.com/docs/en/skills
    - https://help.openai.com/en/articles/20001066
```

这个 metadata 不是 Agent Skills spec 的强制字段，而是本教程针对长期维护的工程化建议。它的价值是让 Skill 不会变成无人负责的行为依赖。[Agent Skills Spec][agent-skills-spec][AWS AgentCore Observability][aws-agentcore-observability]

## 9.9 决策复盘：每一步为什么升级

这个案例的关键不是目录最终有多完整，而是每次升级都有明确理由：

- V0：缺方法，所以写 `SKILL.md`。
- V1：正文太重，所以拆 references / assets。
- V2：引用检查需要确定性，所以加 script。
- V3：需要复用和信任，所以加 evals。
- V4：出现外部动作和权限，所以识别 tool / MCP / connector / workflow 边界。
- V5：出现团队安装和多组件分发，所以升级为 plugin / bundle。
- V6：进入长期使用，所以加 owner、version、review、rollback 和 deprecation。

这条路径综合了 Agent Skills spec 的最小包结构、Anthropic / Claude Code 的 progressive disclosure、OpenAI / Claude plugin 的分发形态、Microsoft 的 tool / skill / workflow 边界，以及第六章和第八章的 eval / lifecycle 机制。[Agent Skills Spec][agent-skills-spec][Anthropic Agent Skills][anthropic-agent-skills][Claude Code Skills][claude-code-skills][OpenAI Plugins][openai-plugins][Microsoft Agent Skills][ms-agent-skills][Microsoft Workflows][ms-workflows]

## 9.10 什么时候停在轻量 Skill 才是正确选择

Pro-level 不等于走到 V6。一个只含 `SKILL.md` 的 lightweight skill，如果触发清楚、正文可执行、边界明确、输出稳定，也可以是专业形态。Agent Skills spec 的最小结构和 Claude Code 的 standalone skill 起点都支持这种轻量路径。[Agent Skills Spec][agent-skills-spec][Claude Code Skills][claude-code-skills]

应该停在轻量形态的情况包括：

- 只有个人使用。
- 没有外部系统。
- 没有副作用。
- 不需要跨团队安装。
- 不需要复杂权限。
- 风险可以通过人工检查控制。
- 内容还在快速探索。

应该升级的情况包括：

- 多人复用。
- 高误触发风险。
- 需要确定性脚本。
- 需要连接外部系统。
- 需要权限、审计、审批。
- 需要发布、回滚、版本控制。
- 真实失败已经出现并需要回归测试。

这就是本教程对 pro-level 的最终定义：

> Pro-level Skill 不是最重的 Skill，而是在正确抽象层级上解决真实问题的 Skill。

这句话是本教程对前八章官方证据和本章案例的综合归纳。[Agent Skills Spec][agent-skills-spec][OpenAI Skills][openai-skills][Microsoft Agent Skills][ms-agent-skills][Agent Skills Evaluation][agent-skills-evaluation]

## 本章小结

第九章把前八章合成了一条构建路径：先判断 capability boundary，再写 V0 `SKILL.md`，再根据真实需求逐步加入 resources、scripts、evals、external boundaries、packaging 和 lifecycle。每一步都应该回答“为什么现在需要升级”，而不是为了显得专业而堆结构。[Agent Skills Spec][agent-skills-spec][Anthropic Best Practices][anthropic-best-practices][OpenAI Plugins][openai-plugins][Microsoft Agent Skills][ms-agent-skills]

到这里，手册主体已经完成：前八章讲原则，第九章讲综合案例。后续更适合进入附录：`SKILL.md` 模板、目录结构模板、activation checklist、eval checklist、security checklist、release checklist 和 changelog 模板。

## Sources

- [Agent Skills Spec][agent-skills-spec]
- [Agent Skills Evaluation][agent-skills-evaluation]
- [Agent Skills Best Practices][agent-skills-best-practices]
- [Anthropic Agent Skills][anthropic-agent-skills]
- [Anthropic Best Practices][anthropic-best-practices]
- [Claude Code Skills][claude-code-skills]
- [Claude Code Plugins][claude-code-plugins]
- [Claude Plugin Marketplace][claude-plugin-marketplace]
- [OpenAI Skills][openai-skills]
- [OpenAI Plugins][openai-plugins]
- [OpenAI API Tools][openai-api-tools]
- [OpenAI Plugin Security][openai-plugin-security]
- [Microsoft Agent Skills][ms-agent-skills]
- [Microsoft Adding Skills][ms-adding-skills]
- [Microsoft Function Tools][ms-function-tools]
- [Microsoft Workflows][ms-workflows]
- [Microsoft Agent Safety][ms-agent-safety]
- [MCP Tools Spec][mcp-tools-spec]
- [AWS AgentCore Gateway][aws-agentcore-gateway]
- [AWS AgentCore Observability][aws-agentcore-observability]
- [xAI Connectors][xai-connectors]

[agent-skills-spec]: https://github.com/agentskills/agentskills/blob/main/docs/specification.mdx
[agent-skills-evaluation]: https://agentskills.io/skill-creation/evaluating-skills
[agent-skills-best-practices]: https://agentskills.io/skill-creation/best-practices
[anthropic-agent-skills]: https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
[anthropic-best-practices]: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
[claude-code-skills]: https://code.claude.com/docs/en/skills
[claude-code-plugins]: https://code.claude.com/docs/en/plugins
[claude-plugin-marketplace]: https://docs.anthropic.com/en/docs/claude-code/plugin-marketplace
[openai-skills]: https://help.openai.com/en/articles/20001066
[openai-plugins]: https://help.openai.com/en/articles/20001256-plugins-in-codex/
[openai-api-tools]: https://platform.openai.com/docs/api-reference/evals/deleteRun?lang=python
[openai-evals]: https://developers.openai.com/api/docs/guides/evals
[openai-plugin-security]: https://developers.openai.com/plugins/guides/security-privacy
[ms-agent-skills]: https://learn.microsoft.com/en-us/agent-framework/agents/skills
[ms-adding-skills]: https://learn.microsoft.com/en-us/agent-framework/journey/adding-skills
[ms-agent-evaluation]: https://learn.microsoft.com/en-us/agent-framework/agents/evaluation
[ms-function-tools]: https://learn.microsoft.com/en-us/agent-framework/agents/tools/function-tools
[ms-workflows]: https://learn.microsoft.com/en-us/agent-framework/workflows/
[ms-agent-safety]: https://learn.microsoft.com/en-us/agent-framework/agents/safety
[mcp-tools-spec]: https://modelcontextprotocol.io/specification/2025-06-18/server/tools
[aws-agentcore-gateway]: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway.html
[aws-agentcore-observability]: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability.html
[aws-agentcore-evaluations]: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/evaluations.html
[xai-connectors]: https://docs.x.ai/grok/connectors
[apple-tool-call-evaluation]: https://developer.apple.com/documentation/Evaluations/evaluating-tool-calling-behavior
