# 第一章 重新理解 Skill：从提示词到能力包

## 本章证据底座

本章主要综合 Agent Skills open specification、Anthropic / Claude Skills、Claude Code Skills、OpenAI Skills / Plugins、Microsoft Agent Framework、AWS AgentCore、xAI Grok、Apple App Intents 等官方或一手资料，用来回答一个基础问题：2026 年语境下，一个 Agent Skill 到底应该被理解成什么。[Agent Skills Spec][agent-skills-spec][Anthropic Agent Skills][anthropic-agent-skills][Claude Code Skills][claude-code-skills][OpenAI Skills][openai-skills][OpenAI Plugins][openai-plugins][Microsoft Agent Skills][ms-agent-skills]

本章不会把所有厂商实践硬拼成一个统一标准。Agent Skills spec、OpenAI Skills、Claude Code Skills 和 Microsoft Agent Framework 可以直接支撑 `SKILL.md`、metadata、progressive disclosure、resources、scripts 等 Skill 机制；AWS AgentCore、xAI Grok、Apple App Intents 更适合用来说明工具、连接器、应用动作和外部能力边界，而不是被强行称为 Skill。[Agent Skills Spec][agent-skills-spec][OpenAI Skills][openai-skills][Claude Code Skills][claude-code-skills][Microsoft Agent Skills][ms-agent-skills][AWS AgentCore Gateway][aws-agentcore-gateway][xAI Connectors][xai-connectors][Apple App Intents][apple-app-intents]

## 1.1 为什么要重新理解 Skill

很多人第一次看到 Skill，会把它理解成“一段更长的提示词”。这个理解太窄。Agent Skills spec 把 skill 定义为一个目录，核心文件是 `SKILL.md`，并允许携带 `scripts/`、`references/`、`assets/` 等辅助内容；这说明 Skill 从一开始就不是单纯 prompt，而是一个可被发现、可被加载、可按需展开的能力包。[Agent Skills Spec][agent-skills-spec]

OpenAI 把 Skills 描述为可复用工作流，并说明 OpenAI Skills follow the Agent Skills open standard；Claude Code 也把 skills 作为 agents 可以动态发现和加载的能力单元；Microsoft Agent Framework 则把 Agent Skills 描述为包含 instructions、scripts、resources 的 portable packages。[OpenAI Skills][openai-skills][Claude Code Skills][claude-code-skills][Microsoft Agent Skills][ms-agent-skills]

因此，本教程对 Skill 的第一层定义是：

> Skill 是一个面向智能体的可复用能力包，用来告诉智能体什么时候进入某类任务、按照什么流程工作、使用哪些参考资料、何时调用脚本或工具、以及如何判断结果是否完成。

这个定义是本教程对多家官方资料的工程化归纳，不是某一家厂商的逐字官方定义。[Agent Skills Spec][agent-skills-spec][Anthropic Agent Skills][anthropic-agent-skills][OpenAI Skills][openai-skills][Microsoft Agent Skills][ms-agent-skills]

## 1.2 Skill 的最小形态：一个可被路由的 `SKILL.md`

最小可移植 Skill 通常是一个目录加一个 `SKILL.md`。Agent Skills spec 要求 `SKILL.md` 的 frontmatter 至少包含 `name` 和 `description`，正文使用 Markdown 承载 instructions；Claude Code 的示例也展示了只包含 `SKILL.md` 的本地 skill。[Agent Skills Spec][agent-skills-spec][Claude Code Skills][claude-code-skills]

这意味着 Skill 的最小价值不是“文件很多”，而是“它能被正确发现并在正确任务中加载”。Agent Skills spec 和 Anthropic 文档都描述了 progressive disclosure：系统先看到 metadata，任务相关时再加载完整 `SKILL.md`，更深的资源文件则按需读取。[Agent Skills Spec][agent-skills-spec][Anthropic Agent Skills Overview][anthropic-agent-skills-overview]

所以，`SKILL.md` 的第一职责不是解释一切，而是承担两个任务：第一，作为路由入口，让智能体知道什么时候使用它；第二，作为操作手册，让智能体知道激活后该怎么做。[Agent Skills Spec][agent-skills-spec][Claude Code Skills][claude-code-skills]

这也是为什么 `description` 不是宣传语。Agent Skills spec 要求 description 说明 skill 做什么、什么时候用；Claude Code 明确说 description 帮助 Claude 判断何时自动使用 skill；Microsoft 也要求 description 包含能帮助 agent 识别相关任务的关键词。[Agent Skills Spec][agent-skills-spec][Claude Code Skills][claude-code-skills][Microsoft Agent Skills][ms-agent-skills]

## 1.3 Skill 的双重身份：说明文件与工程实体

一个成熟 Skill 往往有双重身份。

第一重身份是智能体可读的说明层：`SKILL.md`、`references/`、`assets/`、`scripts/` 共同告诉 agent 何时进入任务、如何处理任务、哪些资料按需读取、哪些确定性步骤可以交给代码。[Agent Skills Spec][agent-skills-spec][Microsoft Agent Skills][ms-agent-skills]

第二重身份是工程生态里的分发层：当一个能力需要跨项目、跨团队、跨 workspace 共享，或者需要权限、版本、安装、发布、审计时，它可能被包装成 zip skill、plugin、marketplace package 或更大的 capability bundle。[OpenAI Plugins][openai-plugins][Claude Code Plugins][claude-code-plugins][Alibaba Skill API][alibaba-skill-api][Volcengine Skill][volcengine-skill]

但这不意味着每个专业 Skill 都必须一开始就做成 Python package、CLI、MCP server 或 plugin。Agent Skills spec 的最小结构仍然只是 `SKILL.md`，scripts、references、assets 都是可选增强；Claude Code 也建议先用 standalone skill 快速迭代，准备共享时再转换为 plugin。[Agent Skills Spec][agent-skills-spec][Claude Code Plugins][claude-code-plugins]

因此，本教程会把“有肉身的 Skill”理解为一种增强形态：当确定性执行、复用边界、发布范围或安全治理需要它时，可以把核心执行能力沉淀为 Python package、CLI、script set、MCP server 或 plugin；但这不是 Skill 成熟度的唯一标准。[Agent Skills Spec][agent-skills-spec][Microsoft Agent Skills][ms-agent-skills][OpenAI Plugins][openai-plugins]

## 1.4 Skill 不是什么

Skill 不是普通提示词。普通提示词通常只存在于一次对话中；Skill 则是可复用、可发现、可按需加载的任务能力包。[Agent Skills Spec][agent-skills-spec][OpenAI Skills][openai-skills]

Skill 也不是 tool。Microsoft 明确区分 tool 是 single callable action，而 skill 是 domain expertise package；OpenAI、xAI、Apple 的 tool / function / App Intent 资料也都把外部动作暴露为带 schema、参数、运行时和权限边界的可调用接口，而不是把动作藏在长提示词里。[Microsoft Adding Skills][ms-adding-skills][OpenAI Tools][openai-tools][xAI Function Calling][xai-function-calling][Apple Tool Calling][apple-tool-calling]

Skill 也不是 MCP server。MCP 更适合承担标准化工具发现、远程调用、schema、authorization、跨客户端复用等协议边界；Skill 可以教 agent 何时使用某类 MCP 工具，但不应该把 MCP 本身误认为 Skill。[MCP Tools Spec][mcp-tools-spec][MCP Authorization][mcp-authorization][AWS AgentCore Gateway][aws-agentcore-gateway]

Skill 也不是 workflow。Microsoft 的边界很清楚：skills 让 AI 在给定 instructions 下决定如何执行，workflows 则显式定义执行路径，适合固定顺序、checkpoint、retry、human approval 和副作用控制。[Microsoft Agent Skills][ms-agent-skills][Microsoft Workflows][ms-workflows]

Skill 也不是 plugin。Plugin 更像分发与产品包装层，可以包含 skills、apps、templates、MCP 配置、hooks、settings 等内容；Skill 可以被 plugin 打包，但 plugin 的职责是安装、发现、权限和分发，不是单个任务方法本身。[OpenAI Plugins][openai-plugins][Claude Code Plugins][claude-code-plugins]

本教程用一句话固定这些边界：

> Skill teaches; resources ground; scripts assist; tools act; workflows govern; platforms operate.

这句话是本教程对 Agent Skills spec、OpenAI、Claude Code、Microsoft、MCP、AWS、xAI、Apple 等资料的综合归纳，用来避免把所有 agent 能力都塞进 Skill 一个概念里。[Agent Skills Spec][agent-skills-spec][OpenAI Skills][openai-skills][Claude Code Skills][claude-code-skills][Microsoft Agent Skills][ms-agent-skills][MCP Tools Spec][mcp-tools-spec][AWS AgentCore Gateway][aws-agentcore-gateway][xAI Connectors][xai-connectors][Apple App Intents][apple-app-intents]

## 1.5 轻量 Skill 与 self-contained bundle

轻量 Skill 和 self-contained bundle 的差异，不是“哪个更专业”，而是“边界有多大、风险有多高、复用范围有多广”。Agent Skills spec 支持最小 `SKILL.md`，也支持可选 `scripts/`、`references/`、`assets/`；Claude Code 和 OpenAI 的 plugin 资料则说明，当能力需要分发、安装、版本、权限或多组件组合时，可以升级为更完整的 bundle。[Agent Skills Spec][agent-skills-spec][Claude Code Plugins][claude-code-plugins][OpenAI Plugins][openai-plugins]

轻量 Skill 适合解决 procedural knowledge：重复粘贴的步骤、检查清单、团队约定、格式规则、输出模板、少量参考资料。Claude Code 文档明确建议，当你反复粘贴同一批 instructions、checklist、multi-step procedure，或某段 `CLAUDE.md` 内容变成 procedure 而不是 fact 时，就适合创建 skill。[Claude Code Skills][claude-code-skills]

Self-contained bundle 适合更宽的交付场景：跨团队安装、组织级权限、marketplace 发布、多个 skills 与 tools / connectors / hooks / settings 组合、版本化升级和安全扫描。Claude Code plugin 结构和 OpenAI Plugins 都把 plugin 描述为可包含多种能力的分发包，而阿里云百炼和火山引擎的 Skill 机制也体现了 zip、版本、扫描、发布等平台化要求。[Claude Code Plugins][claude-code-plugins][OpenAI Plugins][openai-plugins][Alibaba Skill API][alibaba-skill-api][Volcengine Skill][volcengine-skill]

所以，第一章就必须明确一个原则：不要把“完整目录结构”误认为“专业”。一个只含 `SKILL.md`、但触发清晰、流程稳定、边界明确、输出可靠的 Skill，可以比一个塞满脚本和资源但边界混乱的 bundle 更专业。[Agent Skills Spec][agent-skills-spec][Anthropic Best Practices][anthropic-best-practices][Claude Code Skills][claude-code-skills]

## 1.6 Local-First, Cloud-Assisted 的位置

Local-First, Cloud-Assisted 是 2026 年 agent 能力设计的重要取向，但在本教程里它不是口号，而是一条工程边界原则：能在本地稳定完成的确定性处理，应优先落在本地 scripts、CLI、文件系统或包内资源中；需要实时数据、外部系统、权限、审计或跨客户端复用时，再进入 cloud tools、MCP、connectors 或 managed runtime。[Agent Skills Spec][agent-skills-spec][Microsoft Agent Skills][ms-agent-skills][AWS AgentCore Gateway][aws-agentcore-gateway][Apple Foundation Models][apple-foundation-models]

Apple Foundation Models 和 App Intents 展示了本地模型、应用动作与 Private Cloud Compute 的边界思路；AWS AgentCore Gateway 展示了把外部 API、Lambda、MCP target 聚合成受管理工具边界的方式；OpenAI 和 xAI 的 connectors / MCP / tools 资料则体现了云端连接、OAuth、approval、schema 和权限控制的重要性。[Apple Foundation Models][apple-foundation-models][Apple App Intents][apple-app-intents][AWS AgentCore Gateway][aws-agentcore-gateway][OpenAI Tools][openai-tools][xAI Connectors][xai-connectors]

对 Skill 作者来说，Local-First, Cloud-Assisted 的实践含义是：不要为了显得先进就把所有东西做成远程服务，也不要为了本地优先而把认证、授权、审计和危险动作藏进本地脚本。确定性、本地、低风险、紧耦合的辅助逻辑可以放进 skill scripts；跨系统、带权限、可复用、可审计的动作应该升级为 tool、MCP、connector 或 workflow。[Microsoft Agent Skills][ms-agent-skills][MCP Authorization][mcp-authorization][OpenAI Plugins][openai-plugins][Apple Tool Calling][apple-tool-calling]

## 1.7 本教程的成熟度模型

本教程会使用一个从轻到重的成熟度模型。这个模型不是任何一家厂商的正式分级，而是综合 Agent Skills spec、Claude Code Skills / Plugins、OpenAI Skills / Plugins、Microsoft Agent Framework 之后，为教程叙述方便而归纳出的工程路径。[Agent Skills Spec][agent-skills-spec][Claude Code Skills][claude-code-skills][Claude Code Plugins][claude-code-plugins][OpenAI Skills][openai-skills][OpenAI Plugins][openai-plugins][Microsoft Agent Skills][ms-agent-skills]

L0 是 minimal instruction skill：只有 `SKILL.md`，解决触发、主流程和输出契约。

L1 是 progressive disclosure skill：把长参考、模板、样例、schema 拆入 `references/` 和 `assets/`，让主文件保持轻量。

L2 是 script-backed skill：把确定性校验、转换、生成、抽取等操作交给 `scripts/`。

L3 是 eval-gated skill：用 activation tests、sample tasks、script tests、regression fixtures 验证它是否真的可靠。

L4 是 productized capability bundle：当需要分发、权限、版本、外部连接、marketplace 或多组件组合时，把 skill 放入 plugin、zip package、MCP-connected package 或更大的平台能力包。

这套模型的关键不是鼓励所有 Skill 都走到 L4，而是帮助作者判断“停在哪一层最合适”。过早 bundle 化会增加维护成本；过晚工程化会让重要能力长期停留在不可测试、不可分发、不可治理的提示词状态。[Agent Skills Spec][agent-skills-spec][Claude Code Plugins][claude-code-plugins][OpenAI Plugins][openai-plugins][Microsoft Agent Skills][ms-agent-skills]

## 1.8 第一章的判断标准

读完本章后，判断一个能力是否应该做成 Skill，可以先问四个问题：

第一，这个能力是不是主要在教 agent 如何完成某类任务，而不是提供一个稳定 API 动作？如果是，它更像 Skill；如果不是，它可能更适合 tool、MCP 或 connector。[Microsoft Adding Skills][ms-adding-skills][MCP Tools Spec][mcp-tools-spec]

第二，这个能力是否会被重复使用，并且每次都需要相似的步骤、边界、参考资料或输出标准？如果是，它比一次性 prompt 更适合沉淀为 Skill。[Claude Code Skills][claude-code-skills][OpenAI Skills][openai-skills]

第三，它是否需要按需加载资料，而不是把所有内容塞进上下文？如果是，应从一开始就按 progressive disclosure 设计 `SKILL.md`、`references/` 和 `assets/`。[Agent Skills Spec][agent-skills-spec][Anthropic Best Practices][anthropic-best-practices]

第四，它是否涉及外部系统、副作用、权限、审计或组织级分发？如果是，不要只靠 Skill 文本解决，应考虑 tool、MCP、connector、workflow、plugin 或平台治理边界。[OpenAI Plugins][openai-plugins][Microsoft Workflows][ms-workflows][AWS AgentCore Gateway][aws-agentcore-gateway][xAI Connectors][xai-connectors]

## 本章小结

Skill 的核心不是“写一段更长的提示词”，而是把可复用任务能力包装成 agent 能发现、能加载、能执行、能扩展、能验证的结构。最小 Skill 可以只有 `SKILL.md`；更成熟的 Skill 可以逐步加入 references、assets、scripts、evals、tools、MCP、connectors、plugins 和 lifecycle 机制。[Agent Skills Spec][agent-skills-spec][OpenAI Skills][openai-skills][Claude Code Skills][claude-code-skills][Microsoft Agent Skills][ms-agent-skills]

但专业不等于重型化。第一章最重要的结论是：Skill 的专业程度来自清晰边界、稳定触发、可执行流程、按需资源、确定性辅助、可验证质量、安全治理和长期维护，而不是目录数量本身。[Anthropic Best Practices][anthropic-best-practices][Agent Skills Spec][agent-skills-spec][Claude Code Plugins][claude-code-plugins][OpenAI Plugins][openai-plugins]

下一章将进入 Skill 的第一个真正设计面：activation。也就是，在写 `SKILL.md` 正文之前，先设计 agent 什么时候应该发现并使用这个 Skill。

## Sources

- [Agent Skills Spec][agent-skills-spec]
- [Anthropic Agent Skills][anthropic-agent-skills]
- [Anthropic Agent Skills Overview][anthropic-agent-skills-overview]
- [Anthropic Best Practices][anthropic-best-practices]
- [Claude Code Skills][claude-code-skills]
- [Claude Code Plugins][claude-code-plugins]
- [OpenAI Skills][openai-skills]
- [OpenAI Plugins][openai-plugins]
- [OpenAI Tools][openai-tools]
- [Microsoft Agent Skills][ms-agent-skills]
- [Microsoft Adding Skills][ms-adding-skills]
- [Microsoft Workflows][ms-workflows]
- [MCP Tools Spec][mcp-tools-spec]
- [MCP Authorization][mcp-authorization]
- [AWS AgentCore Gateway][aws-agentcore-gateway]
- [Alibaba Skill API][alibaba-skill-api]
- [Volcengine Skill][volcengine-skill]
- [xAI Function Calling][xai-function-calling]
- [xAI Connectors][xai-connectors]
- [Apple Foundation Models][apple-foundation-models]
- [Apple App Intents][apple-app-intents]
- [Apple Tool Calling][apple-tool-calling]

[agent-skills-spec]: https://github.com/agentskills/agentskills/blob/main/docs/specification.mdx
[anthropic-agent-skills]: https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
[anthropic-agent-skills-overview]: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
[anthropic-best-practices]: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
[claude-code-skills]: https://code.claude.com/docs/en/skills
[claude-code-plugins]: https://code.claude.com/docs/en/plugins
[openai-skills]: https://help.openai.com/en/articles/20001066
[openai-plugins]: https://help.openai.com/en/articles/20001256-plugins-in-codex/
[openai-tools]: https://developers.openai.com/api/docs/guides/tools-skills
[ms-agent-skills]: https://learn.microsoft.com/en-us/agent-framework/agents/skills
[ms-adding-skills]: https://learn.microsoft.com/en-us/agent-framework/journey/adding-skills
[ms-workflows]: https://learn.microsoft.com/en-us/agent-framework/workflows/
[mcp-tools-spec]: https://modelcontextprotocol.io/specification/2025-06-18/server/tools
[mcp-authorization]: https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization
[aws-agentcore-gateway]: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway.html
[alibaba-skill-api]: https://help.aliyun.com/zh/model-studio/skills-api/
[volcengine-skill]: https://www.volcengine.com/docs/86681/2205064
[xai-function-calling]: https://docs.x.ai/developers/tools/function-calling
[xai-connectors]: https://docs.x.ai/grok/connectors
[apple-foundation-models]: https://developer.apple.com/documentation/foundationmodels/
[apple-app-intents]: https://developer.apple.com/documentation/appintents
[apple-tool-calling]: https://developer.apple.com/documentation/foundationmodels/expanding-generation-with-tool-calling
