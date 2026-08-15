# 附录 B：Skill 目录结构与 Bundle 形态决策指南

## 本附录证据底座

本附录主要综合 Agent Skills specification、Anthropic / Claude Code Skills best practices、OpenAI Skills / Plugins、Microsoft Agent Framework Skills、MCP specification、AWS AgentCore Gateway 等官方或一手资料，用来回答一个落地问题：一个 Skill 应该停在单个 `SKILL.md`，还是逐步加入 `references/`、`assets/`、`scripts/`、`evals/`，甚至升级为 plugin / capability bundle。[Agent Skills Spec][agent-skills-spec][Anthropic Best Practices][anthropic-best-practices][Claude Code Skills][claude-code-skills][OpenAI Skills][openai-skills][Microsoft Agent Skills][ms-agent-skills]

本附录不会把目录结构当作成熟度竞赛。Agent Skills spec 支持最小 `SKILL.md`，也支持可选 supporting files；OpenAI 和 Claude Code 的 plugin 文档则说明，当能力需要安装、分发、权限、设置、MCP、hooks 或多组件组合时，才进入更大的 bundle 形态。[Agent Skills Spec][agent-skills-spec][OpenAI Plugins][openai-plugins][Claude Code Plugins][claude-code-plugins]

## B.1 目录结构是决策结果，不是起点

一个 Skill 的目录结构应该从 capability boundary 推导出来。第一步不是问“我要不要建 `scripts/` 和 `evals/`”，而是问：这个能力主要是在教 agent 做事，还是在执行一个稳定动作；它需要多少外部知识；哪些步骤必须确定性执行；它会不会触达外部系统；它是否要跨团队分发。[Microsoft Adding Skills][ms-adding-skills][Microsoft Function Tools][ms-function-tools][MCP Tools Spec][mcp-tools-spec]

因此，本手册建议用从轻到重的结构路径：

```text
L0  single-file skill
L1  resource-backed skill
L2  script-backed skill
L3  eval-gated skill
L4  externally integrated capability
L5  productized plugin / bundle
```

这不是任何一家厂商的正式分级，而是本教程对 Agent Skills spec、Claude Code、OpenAI Plugins 和 Microsoft Agent Framework 的工程化归纳。[Agent Skills Spec][agent-skills-spec][Claude Code Skills][claude-code-skills][OpenAI Plugins][openai-plugins][Microsoft Agent Skills][ms-agent-skills]

## B.2 L0：Single-File Skill

L0 的结构只有一个 `SKILL.md`：

```text
skill-name/
  SKILL.md
```

这适合纯 procedural knowledge：重复粘贴的步骤、检查清单、团队约定、格式要求、写作流程、轻量决策框架。Agent Skills spec 要求 portable skill 至少包含 `SKILL.md`，并通过 frontmatter `name` 和 `description` 提供发现入口；Claude Code 也展示了只含 `SKILL.md` 的本地 skill 起点。[Agent Skills Spec][agent-skills-spec][Claude Code Skills][claude-code-skills]

L0 的质量标准不是“内容多”，而是 `description` 能稳定触发、正文能被 agent 执行、输出标准足够清楚。第二章和第三章已经说明，路由事实属于 `description`，已触发后的操作步骤属于 `SKILL.md` body。[Anthropic Best Practices][anthropic-best-practices][Agent Skills Best Practices][agent-skills-best-practices]

应该停在 L0 的情况包括：

- 能力主要是方法、流程或检查清单。
- 没有长参考资料。
- 没有可复用模板或素材。
- 没有确定性脚本需求。
- 没有外部系统、副作用或权限问题。
- 使用范围是个人或单项目。

如果 L0 已经能稳定触发、稳定执行、稳定交付，就不要为了显得专业而继续加目录。

## B.3 L1：Resource-Backed Skill

当 `SKILL.md` 开始承载太多术语、政策、示例、模板或领域知识时，应升级到 L1：

```text
skill-name/
  SKILL.md
  references/
    policy.md
    terminology.md
    examples.md
  assets/
    template.md
```

`references/` 用来放 agent 可能需要读入上下文的知识，例如 API 文档、schema、政策、领域术语、长示例和详细工作流；`assets/` 用来放产物材料，例如模板、图片、字体、样例文件和 boilerplate。OpenAI skill-creator、Agent Skills spec、Anthropic best practices 和 Tencent CodeBuddy / Microsoft 资料都支持把这些内容从主文件中拆出，按需加载。[Agent Skills Spec][agent-skills-spec][Anthropic Best Practices][anthropic-best-practices][OpenAI Skill Creator][openai-skill-creator][Microsoft Agent Skills][ms-agent-skills]

L1 的关键不是“多了文件夹”，而是 `SKILL.md` 变成 overview、workflow 和 routing layer。正文应该写清什么时候读取哪一个 reference、什么时候使用哪一个 asset；不要把所有细节直接复制回正文。[Anthropic Best Practices][anthropic-best-practices][Agent Skills Best Practices][agent-skills-best-practices]

推荐的资源路由写法是：

```markdown
## Use References

- Read `references/policy.md` when policy wording or scope matters.
- Read `references/examples.md` when output shape is unclear.
- Use `assets/template.md` when creating a new artifact from scratch.
```

较长 reference 文件应在顶部提供目录，并且尽量保持从 `SKILL.md` 直接一层可达。Anthropic best practices 和 Agent Skills spec 都提醒，应避免深层 reference chains，因为模型可能只预览部分内容，过深链路会降低可发现性。[Anthropic Best Practices][anthropic-best-practices][Agent Skills Spec][agent-skills-spec]

## B.4 L2：Script-Backed Skill

当某些步骤需要确定性、重复性、文件处理、格式校验、转换、解析或批量生成时，可以升级到 L2：

```text
skill-name/
  SKILL.md
  references/
  assets/
  scripts/
    validate_references.py
    render_report.py
```

`scripts/` 适合封装 agent 每次都容易重写、但其实可以确定执行的逻辑。Agent Skills spec 把 scripts 定义为可选 executable code，并建议脚本自包含、依赖清晰、错误信息友好、能处理边界情况；Anthropic 和 OpenAI 也都把脚本视为提高确定性和节省上下文的方式。[Agent Skills Spec][agent-skills-spec][Anthropic Best Practices][anthropic-best-practices][OpenAI Skill Creator][openai-skill-creator]

适合脚本化：

- Markdown citation closure check。
- 文件格式转换。
- 目录结构校验。
- 固定 schema 校验。
- 从 fixture 生成报告。

不适合脚本化：

- 开放式写作判断。
- 需要和用户澄清目标的任务。
- 带账号、权限、支付、发送、删除、发布等外部副作用的动作。

L2 一旦引入脚本，就必须引入安全意识。Microsoft Agent Framework 明确建议像审查第三方代码一样审查 skills，因为 instructions 会进入上下文，scripts 可以执行代码；它还建议 sandboxing、resource limits、input validation、allow-listing 和 logging。[Microsoft Agent Skills][ms-agent-skills]

## B.5 L3：Eval-Gated Skill

当 Skill 要被多人复用、持续修改、进入团队流程，或者有误触发和误执行风险时，应升级到 L3：

```text
skill-name/
  SKILL.md
  references/
  assets/
  scripts/
  evals/
    activation.json
    body-following.json
    output-fixtures/
```

`evals/` 不是 Agent Skills spec 的必需目录；它是本教程建议的工程化增强位置，用来存放 activation fixtures、false positive fixtures、body-following cases、output fixtures、script tests 和 regression cases。Agent Skills evaluation guidance、OpenAI evals、Microsoft Agent Evaluation 和 AWS AgentCore Evaluations 都说明，agent 能力需要结构化评估，而不是只看最终回答感觉好不好。[Agent Skills Evaluation][agent-skills-evaluation][OpenAI Evals][openai-evals][Microsoft Agent Evaluation][ms-agent-evaluation][AWS AgentCore Evaluations][aws-agentcore-evaluations]

L3 最少应覆盖三类测试：

- Activation：应该触发时触发，不该触发时不触发。
- Body following：触发后是否按 `SKILL.md` 的 workflow、资源路由和停止条件执行。
- Output quality：最终产物是否满足结构、引用、格式、安全和质量标准。

如果 Skill 包含 scripts 或 tools，还应增加 process / trajectory 断言。Apple Tool Call Evaluation、AWS AgentCore Evaluations 和 Microsoft evaluation 资料都说明，工具调用、参数、顺序、trace、span 和过程轨迹本身可以成为评估对象。[Apple Tool Call Evaluation][apple-tool-call-evaluation][AWS AgentCore Evaluations][aws-agentcore-evaluations][Microsoft Agent Evaluation][ms-agent-evaluation]

## B.6 L4：Externally Integrated Capability

当 Skill 需要外部系统、认证、权限、审计、工具 schema、MCP server、connector 或 workflow 时，它已经不只是本地 Skill 目录问题：

```text
skill-name/
  SKILL.md
  references/
  scripts/
  evals/

external-boundary/
  tool schema
  MCP server
  connector configuration
  workflow definition
  approval policy
```

这个示意不是建议把 `external-boundary/` 真放进每个 Skill，而是提醒作者：外部动作应该由明确的 tool、MCP、connector、workflow 或平台治理边界承载。Microsoft 把 tool 定义为 single callable action，把 skill 定义为 domain expertise package；MCP Tools spec 定义工具的 `name`、`description`、`inputSchema` 和可选 `outputSchema`；AWS AgentCore Gateway 也把外部 API、Lambda、MCP targets 聚合到受治理的工具边界中。[Microsoft Adding Skills][ms-adding-skills][MCP Tools Spec][mcp-tools-spec][AWS AgentCore Gateway][aws-agentcore-gateway]

L4 的判断标准是：如果一个动作需要认证、授权、幂等性、审计、审批或跨客户端复用，就不应把它藏在自然语言正文或本地脚本里。Skill 可以教 agent 何时使用工具，但真正的 authority 应由平台、connector、tool server、gateway 或 workflow 执行。[Microsoft Agent Skills][ms-agent-skills][AWS AgentCore Gateway][aws-agentcore-gateway][OpenAI Plugins][openai-plugins]

## B.7 L5：Productized Plugin / Capability Bundle

当能力需要跨团队安装、组织级权限、版本发布、marketplace、默认设置、MCP 配置、hooks、多个 skills 或 app connectors 组合时，才进入 L5：

```text
capability-bundle/
  plugin.json
  skills/
    skill-a/
      SKILL.md
      references/
      scripts/
    skill-b/
      SKILL.md
  apps/
  templates/
  .mcp.json
  settings.json
  hooks/
  CHANGELOG.md
```

这个结构是 productized bundle 的示意，不是 portable Skill 的最小规范。Claude Code plugins 可以包含 commands、agents、skills、hooks、MCP servers、settings 等组件；OpenAI Plugins 也把 plugin 定义为可安装的 workflow capability package，可以包含 skills、apps 和 app templates。[Claude Code Plugins][claude-code-plugins][OpenAI Plugins][openai-plugins]

L5 的专业性来自分发和治理能力：版本、owner、依赖、权限、审核、更新、回滚、禁用、发布说明和安全扫描。第七章和第八章已经说明，进入企业或团队分发后，Skill / plugin 应像 dependency package 一样管理，而不是通过聊天复制或个人路径临时传播。[Microsoft Agent Skills][ms-agent-skills][OpenAI Plugins][openai-plugins][Claude Code Plugins][claude-code-plugins]

因此，`CHANGELOG.md`、release notes、approval record 或 marketplace metadata 不应该被塞进 bare Skill 文件夹作为装饰；它们只在 bundle、plugin、团队分发或长期维护场景中有意义。[OpenAI Plugins][openai-plugins][Claude Code Plugins][claude-code-plugins]

## B.8 决策顺序

选择目录结构时，按下面顺序问：

1. 这个能力是否主要在教 agent 做一类任务？
2. `description` 是否能稳定决定何时触发？
3. `SKILL.md` 正文是否已经能承载主 workflow？
4. 是否有长知识、术语、政策、示例需要移到 `references/`？
5. 是否有模板、图片、字体、样例文件、boilerplate 需要放到 `assets/`？
6. 是否有确定性、重复、易错、可验证的步骤需要 `scripts/`？
7. 是否需要 activation、body-following、output、safety 或 regression fixtures？
8. 是否涉及外部系统、权限、副作用、审计或跨客户端复用？
9. 是否需要跨团队安装、版本发布、admin controls 或 marketplace？

只要某个问题的答案是“否”，通常就不要为了凑齐目录而升级。过早 bundle 化会增加维护成本；过晚工程化会让高风险能力停留在不可测试、不可治理的提示词状态。[Anthropic Best Practices][anthropic-best-practices][Microsoft Agent Skills][ms-agent-skills][Agent Skills Evaluation][agent-skills-evaluation]

## B.9 常见反模式

第一种反模式是 directory theater：能力还没稳定，就先建满 `references/`、`assets/`、`scripts/`、`evals/`、`tools/`。这会让维护负担先于真实需求出现，也让 agent 需要在更多文件中判断哪些内容真正相关。[Anthropic Best Practices][anthropic-best-practices][OpenAI Skill Creator][openai-skill-creator]

第二种反模式是 prompt monolith：所有政策、示例、schema、模板和错误处理都塞进 `SKILL.md`。这违反 progressive disclosure，会让每次激活都加载过多上下文。[Agent Skills Spec][agent-skills-spec][Anthropic Best Practices][anthropic-best-practices]

第三种反模式是 hidden tool：把需要认证、授权、外部系统动作或审计的能力藏在正文或脚本中。第五章和第七章已经说明，这类能力应该升级到 tool、MCP、connector、workflow 或平台治理边界。[Microsoft Function Tools][ms-function-tools][MCP Tools Spec][mcp-tools-spec][AWS AgentCore Gateway][aws-agentcore-gateway]

第四种反模式是 stale bundle：把会频繁变化的 API 价格、权限规则、服务状态或合规状态固定进 Skill 资源文件。稳定方法和术语可以放进 references；实时事实应路由到官方文档、工具或 connector。[Anthropic Best Practices][anthropic-best-practices][AWS AgentCore Gateway][aws-agentcore-gateway]

## 本附录小结

附录 B 的核心结论是：目录结构应该随能力边界逐步生长。L0 到 L5 不是职业阶梯，而是决策梯度。一个轻量 Skill 可以很专业，一个完整 bundle 也可能过度设计；真正的判断标准是触发是否稳定、正文是否可执行、资源是否按需、脚本是否必要、评估是否覆盖风险、安全边界是否清楚、分发和维护是否有真实需求。

## Sources

- [Agent Skills Spec][agent-skills-spec]
- [Agent Skills Best Practices][agent-skills-best-practices]
- [Agent Skills Evaluation][agent-skills-evaluation]
- [Anthropic Best Practices][anthropic-best-practices]
- [Claude Code Skills][claude-code-skills]
- [Claude Code Plugins][claude-code-plugins]
- [OpenAI Skills][openai-skills]
- [OpenAI Skill Creator][openai-skill-creator]
- [OpenAI Plugins][openai-plugins]
- [OpenAI Evals][openai-evals]
- [Microsoft Agent Skills][ms-agent-skills]
- [Microsoft Adding Skills][ms-adding-skills]
- [Microsoft Function Tools][ms-function-tools]
- [Microsoft Agent Evaluation][ms-agent-evaluation]
- [MCP Tools Spec][mcp-tools-spec]
- [AWS AgentCore Gateway][aws-agentcore-gateway]
- [AWS AgentCore Evaluations][aws-agentcore-evaluations]
- [Apple Tool Call Evaluation][apple-tool-call-evaluation]

[agent-skills-spec]: https://github.com/agentskills/agentskills/blob/main/docs/specification.mdx
[agent-skills-best-practices]: https://agentskills.io/skill-creation/best-practices
[agent-skills-evaluation]: https://agentskills.io/skill-creation/evaluating-skills
[anthropic-best-practices]: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
[claude-code-skills]: https://code.claude.com/docs/en/skills
[claude-code-plugins]: https://code.claude.com/docs/en/plugins
[openai-skills]: https://help.openai.com/en/articles/20001066
[openai-skill-creator]: https://github.com/openai/skills/blob/main/skills/.system/skill-creator/SKILL.md
[openai-plugins]: https://help.openai.com/en/articles/20001256-plugins-in-codex/
[openai-evals]: https://developers.openai.com/api/docs/guides/evals
[ms-agent-skills]: https://learn.microsoft.com/en-us/agent-framework/agents/skills
[ms-adding-skills]: https://learn.microsoft.com/en-us/agent-framework/journey/adding-skills
[ms-function-tools]: https://learn.microsoft.com/en-us/agent-framework/agents/tools/function-tools
[ms-agent-evaluation]: https://learn.microsoft.com/en-us/agent-framework/agents/evaluation
[mcp-tools-spec]: https://modelcontextprotocol.io/specification/2025-06-18/server/tools
[aws-agentcore-gateway]: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway.html
[aws-agentcore-evaluations]: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/evaluations.html
[apple-tool-call-evaluation]: https://developer.apple.com/documentation/Evaluations/evaluating-tool-calling-behavior

