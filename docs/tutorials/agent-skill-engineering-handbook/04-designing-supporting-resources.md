# 第四章 Designing Supporting Resources：把知识、资产和脚本放在正确位置

## 本章证据底座

本章主要综合 Anthropic Agent Skills overview / best practices、Agent Skills specification、Microsoft Agent Framework、AWS Bedrock AgentCore / Agent Toolkit、Tencent CodeBuddy Skills、OpenAI Skills / skill-creator、Claude Code Skills、VS Code Agent Skills、Cloudflare Agent Skills 等官方或一手资料，用来说明 Skill supporting resources 的分层方式。[Anthropic Agent Skills Overview][anthropic-agent-skills-overview][Anthropic Best Practices][anthropic-best-practices][Agent Skills Spec][agent-skills-spec][Microsoft Agent Skills][ms-agent-skills][AWS AgentCore Skills][aws-agentcore-skills][Tencent CodeBuddy Skills][tencent-codebuddy-skills]

第三章已经说明，`SKILL.md` 正文应该负责 workflow 和 routing，而不是承载全部细节。第四章进一步展开：当正文决定“需要更多材料”时，这些材料应该放在哪里、如何命名、如何被按需加载。[Anthropic Best Practices][anthropic-best-practices][Agent Skills Spec][agent-skills-spec][OpenAI Skill Creator][openai-skill-creator]

## 4.1 Supporting resources 不是附件，而是上下文架构

Supporting resources 不是“有空再加的附件”。在现代 Skill 设计里，它们是上下文架构的一部分：metadata 先被发现，`SKILL.md` 激活后加载，references / assets / scripts 再按任务需要进入上下文或执行。[Anthropic Agent Skills Overview][anthropic-agent-skills-overview][Agent Skills Spec][agent-skills-spec][Microsoft Agent Skills][ms-agent-skills]

Agent Skills spec 把 `scripts/`、`references/`、`assets/` 作为可选目录；Microsoft Agent Framework 也把 skill 操作拆成 advertise / load skill / read resource / run script；Cloudflare Agent Skills 同样区分 activate skill、read skill resource 和 run skill script。[Agent Skills Spec][agent-skills-spec][Microsoft Agent Skills][ms-agent-skills][Cloudflare Agent Skills][cloudflare-agent-skills]

这说明 supporting resources 的核心价值不是“文件多”，而是让 agent 只在需要时加载正确材料。一个好 Skill 应该让常用流程留在 `SKILL.md`，让细节、模板和确定性执行按需进入任务。[Anthropic Best Practices][anthropic-best-practices][OpenAI Skill Creator][openai-skill-creator]

本章使用这条分工原则：

> `SKILL.md` routes; `references/` explain; `assets/` supply; `scripts/` execute.

这句话是本教程对 Agent Skills spec、Anthropic、OpenAI、Microsoft 和 Tencent CodeBuddy 资料的工程化归纳。[Agent Skills Spec][agent-skills-spec][Anthropic Best Practices][anthropic-best-practices][OpenAI Skill Creator][openai-skill-creator][Microsoft Agent Skills][ms-agent-skills][Tencent CodeBuddy Skills][tencent-codebuddy-skills]

## 4.2 `SKILL.md`：overview、workflow 和 routing layer

`SKILL.md` 是 required file，但它不应该成为所有事实的仓库。Anthropic best practices 建议 `SKILL.md` 指向详细材料；Agent Skills spec 建议把较长内容拆到 referenced files；OpenAI skill-creator guidance 也强调 references 可以保持 `SKILL.md` lean。[Anthropic Best Practices][anthropic-best-practices][Agent Skills Spec][agent-skills-spec][OpenAI Skill Creator][openai-skill-creator]

一个成熟 `SKILL.md` 应保留三类内容：

- Core workflow：当前 skill 被触发后必须遵循的主流程。
- Branch selection：根据任务类型选择哪条路径。
- Resource routing：什么时候读取 reference、使用 asset、运行 script。

它不应该长期承载长 API 文档、完整政策、示例库、历史背景、可复制模板或大量代码。那些内容分别属于 `references/`、`assets/` 或 `scripts/`。[Agent Skills Spec][agent-skills-spec][Anthropic Best Practices][anthropic-best-practices][Tencent CodeBuddy Skills][tencent-codebuddy-skills]

一个清晰的 routing table 比散落在段落里的提示更可靠：

```markdown
## Resources

| Need | Use |
| --- | --- |
| API methods and error codes | Read [references/api-reference.md](references/api-reference.md) |
| Policy decisions and exceptions | Read [references/policy-rules.md](references/policy-rules.md) |
| Output examples and edge cases | Read [references/examples.md](references/examples.md) |
| Final report template | Use [assets/report-template.md](assets/report-template.md) |
| Validate final output | Run `scripts/validate.py` |
```

这个表要区分 read、use 和 run。读取 reference、使用 asset、执行 script 是三种不同动作；混在一起会导致 agent 把模板当说明读，或者把脚本当普通参考看。[Claude Code Skills][claude-code-skills][VS Code Agent Skills][vscode-agent-skills][Agent Skills Spec][agent-skills-spec]

## 4.3 `references/`：可按需读取的知识

`references/` 适合放 agent 可能需要读入上下文的材料：API docs、database schema、domain knowledge、policy rules、workflow guides、长示例、edge cases、格式说明。[Agent Skills Spec][agent-skills-spec][OpenAI Skill Creator][openai-skill-creator][Tencent CodeBuddy Skills][tencent-codebuddy-skills][Microsoft Agent Skills][ms-agent-skills]

Reference 文件应该 focused。一个 reference 最好服务一个任务分支、一个决策点或一个知识域，而不是把所有深度资料塞进一个 `everything.md`。这样 agent 读取一个文件时，不会把无关上下文也带进任务。[Anthropic Best Practices][anthropic-best-practices][OpenAI Skill Creator][openai-skill-creator]

Anthropic best practices 和 Agent Skills spec 都建议避免深层 reference chain：`SKILL.md` 应直接链接需要的 reference，而不是让 reference 再去链接另一个隐藏 reference。[Anthropic Best Practices][anthropic-best-practices][Agent Skills Spec][agent-skills-spec]

推荐结构是：

```text
skill-name/
  SKILL.md
  references/
    api-reference.md
    policy-rules.md
    examples.md
  assets/
    report-template.md
  scripts/
    validate.py
```

如果某个 reference 超过 100 行，Anthropic best practices 建议在顶部加入 contents section，让 agent 即使只预览文件，也能看到完整内容范围和跳转方向。[Anthropic Best Practices][anthropic-best-practices]

## 4.4 `assets/`：输出产物的材料

`assets/` 和 `references/` 的区别在于：reference 是 agent 读进上下文的知识，asset 是 agent 用来生成、复制、转换或嵌入最终产物的材料。Agent Skills spec 把 templates、images、data files 列为 assets；OpenAI skill-creator 和 Tencent CodeBuddy 也把 assets 定义为用于输出的资源。[Agent Skills Spec][agent-skills-spec][OpenAI Skill Creator][openai-skill-creator][Tencent CodeBuddy Skills][tencent-codebuddy-skills]

适合放进 `assets/` 的内容包括：

- document templates。
- slide templates。
- report skeletons。
- icons、fonts、images。
- boilerplate files。
- sample documents。
- static lookup data。
- schema files that are copied or validated against。

模板选择规则不一定放在 asset 里。更好的做法是：把可复制或可填充的模板放进 `assets/`，把选择模板的规则放在 `SKILL.md` 或 focused reference 里。[OpenAI Skill Creator][openai-skill-creator][Anthropic Best Practices][anthropic-best-practices]

例如：

```markdown
For a board-report request, copy `assets/board-report-template.docx`.
Read `references/board-report-fields.md` only when deciding which sections to include.
Run `scripts/check_report.py` before delivery.
```

这样 agent 能清楚区分：模板是要被使用的文件，字段说明是要读取的知识，检查脚本是要执行的程序。[Agent Skills Spec][agent-skills-spec][OpenAI Skill Creator][openai-skill-creator]

## 4.5 `scripts/`：确定性执行，而不是装饰性代码

`scripts/` 适合放确定性、可执行、可重复的行为：validation、conversion、data processing、fragile file manipulation、repeated calculation、format checking、artifact generation。[Anthropic Agent Skills Overview][anthropic-agent-skills-overview][Agent Skills Spec][agent-skills-spec][Microsoft Agent Skills][ms-agent-skills][AWS AgentCore Skills][aws-agentcore-skills]

Anthropic、OpenAI、Microsoft、AWS、Tencent 和 Cloudflare 都把 scripts 与 readable resources 区分开：scripts 是可执行代码，通常输出结果进入上下文，而不是要求 agent 阅读整段源码来完成任务。[Anthropic Agent Skills Overview][anthropic-agent-skills-overview][OpenAI Skill Creator][openai-skill-creator][Microsoft Agent Skills][ms-agent-skills][Cloudflare Agent Skills][cloudflare-agent-skills]

一个 script 加入 Skill 前，至少应该满足三个条件：

第一，模型生成文本不如代码可靠。

第二，这个操作会重复出现。

第三，脚本的依赖、输入、输出、失败行为可以被清楚说明。

Agent Skills spec 建议 scripts 自包含、说明依赖、提供友好错误并处理边界情况；Microsoft 进一步强调 script execution 需要 runner、sandboxing、resource limits、input validation、allow-listing、structured logging 和 audit trails。[Agent Skills Spec][agent-skills-spec][Microsoft Agent Skills][ms-agent-skills]

所以，`scripts/` 不是“显得专业”的目录。没有确定性收益的脚本只会增加维护面和安全面。[Anthropic Best Practices][anthropic-best-practices][OpenAI Skill Creator][openai-skill-creator]

## 4.6 examples：放正文、reference，还是 asset

示例应该根据用途放置。

如果示例很短，并且直接定义核心输出合同，可以放在 `SKILL.md` 正文。Agent Skills spec 和 Anthropic best practices 都建议在正文中使用 examples，但前提是它们确实帮助 agent 执行任务。[Agent Skills Spec][agent-skills-spec][Anthropic Best Practices][anthropic-best-practices]

如果示例很多、很长，或只服务某个分支，应放到 `references/examples.md`，并从 `SKILL.md` 直接链接。[Anthropic Best Practices][anthropic-best-practices][Claude Code Skills][claude-code-skills]

如果示例是完整文件，需要复制、打开、转换、视觉检查或作为产物材料使用，应放到 `assets/`，或在 host convention 支持时放到 `examples/`。VS Code 和 Claude Code 都展示了 additional files / examples 需要从 `SKILL.md` 直接引用，才能被 agent 正确发现。[VS Code Agent Skills][vscode-agent-skills][Claude Code Skills][claude-code-skills]

示例命名应按 scenario，而不是按编号。例如 `edge-case-missing-address.md` 比 `example-3.md` 更利于 agent 和维护者理解用途。[Anthropic Best Practices][anthropic-best-practices]

## 4.7 conditional workflow：正文做分支，资源做深度

复杂 Skill 常常不是线性流程，而是条件流程。Anthropic best practices 给出按领域组织的例子：finance、sales、product、marketing 等不同问题路由到不同 reference；OpenAI plugin / skill examples 也常用 references table 把 topic 映射到文件。[Anthropic Best Practices][anthropic-best-practices][OpenAI Writing Skills][openai-writing-skills][OpenAI Plugin Creator][openai-plugin-creator]

本教程建议采用 conditional workflow pattern：

```markdown
## Workflow

1. Classify the request:
   - API implementation: read [references/api-reference.md](references/api-reference.md).
   - Policy exception: read [references/policy-rules.md](references/policy-rules.md).
   - Output formatting: use [assets/report-template.md](assets/report-template.md).
2. Use only the branch-specific file needed for the request.
3. Run the relevant validator before finalizing.
```

这个模式的价值是：`SKILL.md` 负责 branch selection，reference / asset / script 负责分支深度。agent 不需要把所有分支资料一次性读完。[Anthropic Best Practices][anthropic-best-practices][Microsoft Agent Skills][ms-agent-skills][Cloudflare Agent Skills][cloudflare-agent-skills]

## 4.8 避免 duplication：一个事实只住一个地方

OpenAI skill-creator guidance 明确指出，信息应该存在于 `SKILL.md` 或 reference files 之一，不应该两边重复；Anthropic progressive disclosure 也隐含同样原则：正文是 overview 和 routing layer，细节放在 supporting files。[OpenAI Skill Creator][openai-skill-creator][Anthropic Best Practices][anthropic-best-practices]

重复会带来两个问题。第一，agent 可能读到互相冲突的版本。第二，维护者更新一处时容易忘记另一处，导致 Skill 自我矛盾。

本教程建议：

- 必须每次执行都遵守的流程判断，放在 `SKILL.md`。
- 长政策、schema、详细示例、背景知识，放在 `references/`。
- 可复制、可转换、可作为产物材料的文件，放在 `assets/`。
- 可执行、可重复、可验证的操作，放在 `scripts/`。

这个分配原则来自多家官方资料对 instructions、resources、scripts 的时机和执行模式区分。[Agent Skills Spec][agent-skills-spec][Microsoft Agent Skills][ms-agent-skills][Cloudflare Agent Skills][cloudflare-agent-skills][Tencent CodeBuddy Skills][tencent-codebuddy-skills]

## 4.9 避免 stale content：不要把会变的世界封进 Skill

Skill bundle 很容易变成旧知识容器。Anthropic 的 security discussion 提醒，依赖外部数据的 skills 会受到外部依赖变化影响；Alibaba Cloud Skills Portal 强调官方 cloud skills 内嵌当前 API 方法，避免 agent 依赖过时训练数据；AWS Agent Toolkit 也强调通过 MCP 获取实时文档和当前服务能力。[Anthropic Agent Skills Overview][anthropic-agent-skills-overview][Alibaba Skills Portal][alibaba-skills-portal][AWS Agent Toolkit][aws-agent-toolkit]

本教程建议：稳定政策、长期有效格式、内部约定可以放进 references；快速变化的价格、rate limits、API availability、compliance status、service region、release notes 不应静态写死，除非明确标注日期并要求使用前验证。[Anthropic Best Practices][anthropic-best-practices][AWS Agent Toolkit][aws-agent-toolkit]

对于 stable internal policy，reference 文件顶部可以写 owner 和 last-reviewed date。这样维护者知道谁负责它，agent 也能识别这份资料的时效边界。

例如：

```markdown
---
owner: docs-platform
last_reviewed: 2026-08-15
staleness_risk: medium
---
```

这不是 Agent Skills spec 的强制字段，而是本教程针对长期维护的工程化建议；第八章会进一步展开 lifecycle 和 stale-content sweep。[Agent Skills Spec][agent-skills-spec][Anthropic Best Practices][anthropic-best-practices]

## 4.10 命名和术语一致性

Anthropic best practices 建议使用一致命名，因为一致命名能让 skills 更容易引用、理解、组织、搜索和维护；Agent Skills spec、Microsoft 和 VS Code 也对 skill name / directory / frontmatter 关系给出约束或建议。[Anthropic Best Practices][anthropic-best-practices][Agent Skills Spec][agent-skills-spec][Microsoft Agent Skills][ms-agent-skills][VS Code Agent Skills][vscode-agent-skills]

一致性不只发生在 skill name 上，也发生在 reference filename、routing heading、example name、script name 和正文术语上。

如果正文叫 “policy exceptions”，reference 文件却叫 `rules.md`，script 又叫 `check_compliance.py`，agent 和维护者都更容易迷路。更好的方式是让同一概念在文件名、标题、路由表和示例中保持同名。

例如：

```text
references/policy-exceptions.md
scripts/validate-policy-exceptions.py
assets/policy-exception-report-template.md
```

命名一致不是洁癖，而是降低 retrieval 和维护成本。[Anthropic Best Practices][anthropic-best-practices][VS Code Agent Skills][vscode-agent-skills]

## 4.11 本章检查清单

设计 supporting resources 时，检查这些问题：

- `SKILL.md` 是否只保留 core workflow、branch selection 和 routing。
- 每个 reference 是否 focused，并且直接从 `SKILL.md` 链接。
- 超过 100 行的 reference 是否有 contents section。
- 是否避免了 reference 链接 reference 的深层路径。
- `assets/` 是否只放输出材料，而不是说明文档。
- `scripts/` 是否只放确定性、可重复、可验证的执行逻辑。
- routing table 是否区分 read、use、run。
- 是否避免了 `SKILL.md` 与 references 的重复。
- 是否把时效性信息改为路由到官方来源或 live tool。
- 命名是否在正文、文件名、示例和脚本之间保持一致。

这份检查清单是本教程对 Anthropic、Agent Skills spec、OpenAI、Microsoft、Tencent、AWS 等资料的资源架构归纳，用来避免 Skill 变成单文件知识 dump 或无边界文件夹。[Anthropic Best Practices][anthropic-best-practices][Agent Skills Spec][agent-skills-spec][OpenAI Skill Creator][openai-skill-creator][Microsoft Agent Skills][ms-agent-skills][Tencent CodeBuddy Skills][tencent-codebuddy-skills][AWS AgentCore Skills][aws-agentcore-skills]

## 本章小结

第四章的核心结论是：supporting resources 是 Skill 的上下文架构。`SKILL.md` 不负责承载所有知识，它负责告诉 agent 什么时候读取知识、什么时候使用资产、什么时候运行脚本。[Anthropic Best Practices][anthropic-best-practices][Agent Skills Spec][agent-skills-spec][Microsoft Agent Skills][ms-agent-skills]

专业 Skill 的资源组织应该让每个文件的用途一眼可见：`references/` 是可读知识，`assets/` 是产物材料，`scripts/` 是确定性执行。下一章将继续讨论边界升级：什么时候保留在 scripts，什么时候应该升级为 tool、MCP、connector、workflow 或 plugin。[Agent Skills Spec][agent-skills-spec][OpenAI Skill Creator][openai-skill-creator][Tencent CodeBuddy Skills][tencent-codebuddy-skills]

## Sources

- [Anthropic Agent Skills Overview][anthropic-agent-skills-overview]
- [Anthropic Best Practices][anthropic-best-practices]
- [Agent Skills Spec][agent-skills-spec]
- [Microsoft Agent Skills][ms-agent-skills]
- [AWS AgentCore Skills][aws-agentcore-skills]
- [AWS Agent Toolkit][aws-agent-toolkit]
- [Tencent CodeBuddy Skills][tencent-codebuddy-skills]
- [OpenAI Skills][openai-skills]
- [OpenAI Academy Skills][openai-academy-skills]
- [OpenAI Skill Creator][openai-skill-creator]
- [OpenAI Writing Skills][openai-writing-skills]
- [OpenAI Plugin Creator][openai-plugin-creator]
- [Claude Code Skills][claude-code-skills]
- [VS Code Agent Skills][vscode-agent-skills]
- [Cloudflare Agent Skills][cloudflare-agent-skills]
- [Alibaba Skills Portal][alibaba-skills-portal]

[anthropic-agent-skills-overview]: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
[anthropic-best-practices]: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
[agent-skills-spec]: https://agentskills.io/specification
[ms-agent-skills]: https://learn.microsoft.com/en-us/agent-framework/agents/skills
[aws-agentcore-skills]: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness-skills.html
[aws-agent-toolkit]: https://github.com/aws/agent-toolkit-for-aws
[tencent-codebuddy-skills]: https://intl.cloud.tencent.com/document/product/1256/77295?lang=en
[openai-skills]: https://help.openai.com/en/articles/20001066
[openai-academy-skills]: https://openai.com/academy/skills/
[openai-skill-creator]: https://github.com/openai/skills/blob/main/skills/.system/skill-creator/SKILL.md
[openai-writing-skills]: https://github.com/openai/plugins/blob/main/plugins/superpowers/skills/writing-skills/SKILL.md
[openai-plugin-creator]: https://github.com/openai/plugins/blob/main/.agents/skills/plugin-creator/SKILL.md
[claude-code-skills]: https://code.claude.com/docs/en/slash-commands
[vscode-agent-skills]: https://github.com/microsoft/vscode-docs/blob/main/docs/agent-customization/agent-skills.md
[cloudflare-agent-skills]: https://developers.cloudflare.com/agents/runtime/execution/agent-skills/
[alibaba-skills-portal]: https://www.alibabacloud.com/help/en/skillsportal/learn-about-the-alibaba-cloud-agent-skills-portal
