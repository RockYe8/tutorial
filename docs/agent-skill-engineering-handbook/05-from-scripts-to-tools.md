# 第五章 From Scripts to Tools：Skill 的工程边界

## 本章证据底座

本章主要综合 Agent Skills specification、Anthropic Agent Skills、OpenAI Skills / Plugins / tools、Microsoft Agent Framework、MCP specification、AWS AgentCore、Alibaba Model Studio、Tencent ADP、Volcengine AgentKit、xAI Grok、Apple Foundation Models / App Intents 等官方或一手资料，用来回答一个工程问题：一个能力应该停留在 Skill、script，还是升级为 tool、MCP、connector、workflow 或 plugin。[Agent Skills Spec][agent-skills-spec][Anthropic Agent Skills][anthropic-agent-skills][OpenAI Skills][openai-skills][OpenAI Plugins][openai-plugins][Microsoft Agent Skills][ms-agent-skills]

本章不是 MCP 教程，也不是插件开发手册。它的目标是建立边界判断：什么时候保持轻量，什么时候加脚本，什么时候必须把能力提升到更显式、更可测试、更可授权的工程接口。[Microsoft Agent Skills][ms-agent-skills][Microsoft Function Tools][ms-function-tools][MCP Tools Spec][mcp-tools-spec][AWS AgentCore Gateway][aws-agentcore-gateway]

## 5.1 为什么第五章要讲工程边界

第四章已经把 supporting resources 分成 `references/`、`assets/`、`scripts/`。但真正困难的问题不是“有没有 scripts 目录”，而是：某个执行能力到底应该继续作为 Skill 内部脚本，还是升级为 tool、MCP server、connector、workflow 或 plugin。[Agent Skills Spec][agent-skills-spec][Microsoft Agent Skills][ms-agent-skills]

2026 年主流实践呈现一个共同模式：Skill 适合承载可复用 procedure、domain policy、examples、references、templates 和少量确定性 helper scripts；function / tool / MCP 适合承载 typed callable capability；connector 适合承载认证过的外部系统连接；workflow 适合承载显式流程控制；plugin / capability bundle 适合承载可发现、可安装、可治理的能力组合。[OpenAI Skills][openai-skills][Microsoft Agent Skills][ms-agent-skills][MCP Tools Spec][mcp-tools-spec][xAI Connectors][xai-connectors][OpenAI Plugins][openai-plugins]

因此，本章的核心问题是：

> 能力边界应该放在 agent 的上下文里，还是放在一个可调用、可授权、可测试、可治理的运行时接口里？

这句话是本教程对 OpenAI、Microsoft、MCP、AWS、xAI 和 Apple 等资料的工程化归纳。[OpenAI API Tools][openai-api-tools][Microsoft Function Tools][ms-function-tools][MCP Tools Spec][mcp-tools-spec][AWS AgentCore Gateway][aws-agentcore-gateway][Apple Tool Calling][apple-tool-calling]

## 5.2 第一层：保留在 `SKILL.md`

当问题本质是“agent 缺少方法、顺序、判断标准或输出约定”时，能力应该先留在 `SKILL.md`。Agent Skills spec 把 skill 设计为 `SKILL.md` 加可选 supporting files 的轻量包；OpenAI Skills 把 skills 描述为 reusable workflows；Microsoft 也把 Agent Skills 描述为 portable packages of instructions、scripts、resources。[Agent Skills Spec][agent-skills-spec][OpenAI Skills][openai-skills][Microsoft Agent Skills][ms-agent-skills]

适合留在 `SKILL.md` 的内容包括：

- 任务什么时候开始。
- 需要检查哪些输入。
- 按什么步骤工作。
- 什么时候读取 reference。
- 输出应该长什么样。
- 什么时候询问、停止或拒绝。

如果一个能力只是在教 agent 如何做某类任务，不需要稳定 schema、不需要外部权限、不需要跨系统调用、不需要确定性执行，那它不应该一开始就被做成 tool 或 MCP server。[Agent Skills Spec][agent-skills-spec][Anthropic Agent Skills][anthropic-agent-skills]

这里的反模式是“过早平台化”：把一个本来可以用 50 行 `SKILL.md` 解决的问题，做成脚本、CLI、MCP server 和 plugin。这样会增加测试、权限、安装、发布和维护成本，却不一定提升任务质量。[Anthropic Agent Skills][anthropic-agent-skills][OpenAI Skills][openai-skills]

## 5.3 第二层：拆到 `references/` 或 `assets/`

如果问题不是缺少执行能力，而是上下文太重，应该先拆 references 和 assets，而不是急着写工具。Agent Skills spec 和 Anthropic 都建议把长内容拆入 referenced files，让 agent 按需读取；OpenAI skill guidance 也强调 references 能保持 `SKILL.md` lean。[Agent Skills Spec][agent-skills-spec][Anthropic Agent Skills][anthropic-agent-skills][OpenAI Skills][openai-skills]

当 agent 需要读取政策、schema、API 文档、示例库、背景知识时，用 `references/`。当 agent 需要复制、填充、转换或嵌入模板、图片、样例文件、静态数据时，用 `assets/`。[Agent Skills Spec][agent-skills-spec][Microsoft Agent Skills][ms-agent-skills]

这一步的判断很简单：

> 如果问题是“知识太多”，先拆资源；如果问题是“动作需要可靠执行”，再考虑脚本或工具。

这句话是本教程对 progressive disclosure 和 supporting resources guidance 的实践归纳。[Agent Skills Spec][agent-skills-spec][Anthropic Agent Skills][anthropic-agent-skills][Microsoft Agent Skills][ms-agent-skills]

## 5.4 第三层：使用 `scripts/`

当某个操作本地、确定、重复、可测试，并且用代码比用自然语言更可靠时，适合放进 `scripts/`。Anthropic explicitly motivates scripts for operations that are cheaper, more reliable, and more repeatable as traditional code；Agent Skills spec 也把 `scripts/` 定义为 executable code，并建议脚本自包含、说明依赖、给出友好错误、处理边界情况。[Anthropic Agent Skills][anthropic-agent-skills][Agent Skills Spec][agent-skills-spec]

适合脚本化的任务包括：

- 解析文件。
- 提取 metadata。
- 校验 schema。
- 渲染文档。
- 转换格式。
- 批量重命名。
- 检查引用链接。
- 生成确定性 artifact。

Microsoft Agent Framework 给 scripts 加了重要安全边界：script execution 需要配置 script runner；如果 file-based skills 含 scripts 但没有 runner，会报错。Microsoft 也强调 sandboxing、resource limits、input validation、allow-listing、structured logging 和 audit trails。[Microsoft Agent Skills][ms-agent-skills]

所以 script 是 Skill 的私有执行助手，不是公共 agent 接口。它应该由 `SKILL.md` 明确说明何时运行、如何传参、输出代表什么、失败后如何处理。[Agent Skills Spec][agent-skills-spec][Microsoft Agent Skills][ms-agent-skills]

## 5.5 第四层：升级为 function / tool

当能力需要稳定输入输出、schema、runtime context、权限控制、跨 agent 复用或 API 级测试时，就应该从 script 升级为 function / tool。OpenAI function tools 使用 JSON Schema 参数和 description，支持 strict schema adherence；Microsoft function tools 可以来自 typed functions、Pydantic models、raw JSON Schema 或 Go structs；xAI function calling 也使用 name、description 和 parameters JSON Schema。[OpenAI Function Calling][openai-function-calling][Microsoft Function Tools][ms-function-tools][xAI Function Calling][xai-function-calling]

Tool 与 script 的区别在于：script 通常是某个 Skill 的内部 helper；tool 是 agent 可选择调用的稳定能力边界。[Microsoft Function Tools][ms-function-tools][Microsoft Agent Skills][ms-agent-skills]

如果其他 skills、agents、apps 或用户界面也需要这个能力，就不要把它藏在某个 skill 的 `scripts/` 里。把它做成 tool，会让 schema、测试、权限、错误处理和复用边界更清楚。[OpenAI API Tools][openai-api-tools][Microsoft Function Tools][ms-function-tools]

一个实用判断是：

> 如果调用者需要依赖输入输出形状，先写 schema；一旦 schema 成为核心，能力就已经越过了纯 Skill prose 的边界。

这句话是本教程对 OpenAI、MCP、Microsoft、AWS、xAI 和 Apple structured / tool calling 资料的归纳。[OpenAI Function Calling][openai-function-calling][MCP Tools Spec][mcp-tools-spec][Microsoft Function Tools][ms-function-tools][AWS Bedrock Action Groups][aws-bedrock-action-groups][Apple Foundation Models][apple-foundation-models]

## 5.6 第五层：升级为 MCP server

当一组 tools、resources 或 prompts 需要标准 client-server protocol、discovery、remote hosting、aggregation、authorization 和跨模型客户端复用时，MCP 是更合适的边界。MCP Tools spec 定义 tools 的 `name`、`description`、`inputSchema`、可选 `outputSchema` 和 tool annotations；MCP authorization spec 则定义了 HTTP transports 的授权机制。[MCP Tools Spec][mcp-tools-spec][MCP Authorization][mcp-authorization]

AWS AgentCore Gateway 把 APIs、Lambda functions、Smithy models 和 existing services 转换 / 聚合为 MCP-compatible tools，并提供 ingress / egress auth、credential exchange、auditing 和 aggregation；xAI custom MCP connectors 允许客户通过 MCP 暴露内部 API、数据库或 SaaS tools。[AWS AgentCore Gateway][aws-agentcore-gateway][xAI Connectors][xai-connectors]

因此，MCP 不是“更高级的 Skill”。MCP 是工具生态的协议边界。Skill 可以教 agent 什么时候使用某个 MCP tool；MCP server 则负责让工具被发现、调用、授权和复用。[MCP Tools Spec][mcp-tools-spec][Microsoft Agent Skills][ms-agent-skills]

当你只是想让一个 Skill 内部校验 Markdown，不需要 MCP。当你要暴露一组可复用工具给多个客户端、多个 agents 或多个产品，MCP 才开始值得。[MCP Tools Spec][mcp-tools-spec][AWS AgentCore Gateway][aws-agentcore-gateway]

## 5.7 第六层：使用 connector

Connector 的关键词是 authenticated bridge。OpenAI 区分 apps / connectors、plugins 和 skills：apps connect ChatGPT / Codex to external tools, information, and actions；plugins 是可以包含 apps、skills、templates 的 package。[OpenAI Apps][openai-apps][OpenAI Plugins][openai-plugins]

xAI connectors 也用于让 Grok 在对话中访问外部 tools 和 data sources，内置或 catalog connectors 使用 OAuth，Business / Enterprise 管理员可以先 provision connectors，再让成员连接账户。[xAI Connectors][xai-connectors][xAI Connector Management][xai-connector-management]

因此，connector 不是“写在 Skill 里的登录说明”。当能力涉及 SaaS、企业系统、OAuth、scopes、admin provisioning、revocation、source boundaries 或 data access controls 时，它应该进入 connector / app 边界。[OpenAI Apps][openai-apps][xAI Connectors][xai-connectors]

Skill 在这里的作用是说明“什么时候需要这个连接器、如何解释结果、如何处理权限不足”，而不是把认证逻辑藏进提示词。[OpenAI Plugins][openai-plugins][xAI Connector Management][xai-connector-management]

## 5.8 第七层：升级为 workflow

Workflow 适合处理过程本身必须被显式治理的任务。Microsoft 给出清晰边界：skills 让 AI 决定如何执行 instructions；workflows 显式定义 execution path。Workflows 适合 deterministic steps、checkpointing、expensive retries、side effects、multiple agents、external integrations 和 human approvals。[Microsoft Agent Skills][ms-agent-skills][Microsoft Workflows][ms-workflows]

Alibaba Model Studio workflow applications 把复杂任务拆成 ordered steps，可组合 LLM、API、function compute、MCP、plugin、application components，并支持 retry 和 exception handling；Tencent ADP 也把 workflow mode 用于固定业务流程，Multi-Agent 还可以把已有 workflow 作为 tool 复用。[Alibaba Workflow][alibaba-workflow][Tencent ADP][tencent-adp]

如果一个过程不能允许 agent 即兴发挥，workflow 往往比 Skill 更合适。尤其是带副作用、需要 checkpoint、需要用户审批、失败后不能简单重试的流程，不应该只靠 `SKILL.md` 文本约束。[Microsoft Workflows][ms-workflows][Microsoft Agent Safety][ms-agent-safety]

本教程的判断是：

> Skill teaches flexible execution; workflow governs deterministic process.

这是对 Microsoft、Alibaba、Tencent 和 Volcengine 资料的工程化归纳。[Microsoft Agent Skills][ms-agent-skills][Microsoft Workflows][ms-workflows][Alibaba Workflow][alibaba-workflow][Tencent ADP][tencent-adp][Volcengine AgentKit][volcengine-agentkit]

## 5.9 第八层：打包为 plugin / capability bundle

Plugin 或 capability bundle 的关键词是 distribution。OpenAI Plugins 可以包含 skills、apps 和 app templates；Claude / OpenAI 风格的 plugin guidance 也体现了 skills 与 apps / MCP / hooks / assets / marketplace metadata 一起交付的分发边界。[OpenAI Plugins][openai-plugins][OpenAI Plugin Guidance][openai-plugin-guidance]

当能力需要 workspace 安装、admin controls、marketplace discovery、版本发布、权限继承、多个 skills / connectors / templates 组合时，它就不再只是单个 Skill，而是产品化能力包。[OpenAI Plugins][openai-plugins][Alibaba Custom Plugins][alibaba-custom-plugins][Tencent ADP][tencent-adp]

这也是为什么 self-contained bundle 是企业级常见形态，但不是所有 Skill 的起点。一个个人 lightweight instruction skill 可能已经足够专业；只有当复用范围、治理需求和分发需求扩大时，才需要 plugin / bundle。[Agent Skills Spec][agent-skills-spec][OpenAI Plugins][openai-plugins]

## 5.10 Local-First, Cloud-Assisted 的边界判断

Local-first 不等于无约束本地执行。Claude Code 把 permissions 和 sandboxing 分开：permissions 管工具是否可尝试，sandboxing 管 Bash 和 child processes 的 OS-level 限制；Microsoft local shell tools 默认需要 approval；AWS AgentCore Code Interpreter 在 containerized sandbox 中执行代码。[Claude Code Permissions][claude-code-permissions][Microsoft Function Tools][ms-function-tools][AWS Code Interpreter][aws-code-interpreter]

Cloud-assisted 也不等于把所有能力都远程化。Apple Foundation Models 可以 on-device 运行；Private Cloud Compute 用于需要更多 reasoning / context 的场景；App Intents 则让 app code 成为系统可调用能力的 source of truth。[Apple Foundation Models][apple-foundation-models][Apple Intelligence][apple-intelligence][Apple App Intents][apple-app-intents]

对 Skill 作者来说，Local-First, Cloud-Assisted 应该落成这样一条判断：

> 本地、确定、低风险、紧耦合的辅助操作，优先放在 scripts 或本地 CLI；需要实时数据、认证、授权、审计、跨客户端复用或远程系统连接时，升级为 tool、MCP、connector 或 workflow。

这句话是本教程对 Claude Code、Microsoft、AWS、OpenAI、Apple 等资料的归纳。[Claude Code Permissions][claude-code-permissions][Microsoft Agent Skills][ms-agent-skills][AWS AgentCore Gateway][aws-agentcore-gateway][OpenAI Apps][openai-apps][Apple App Intents][apple-app-intents]

## 5.11 side effects 是最强升级信号

副作用是从 Skill / script 升级为 tool / workflow 的最强信号。Microsoft safety guidance 明确说，修改数据、发送通信、购买、访问敏感数据、执行不可逆操作或产生广泛影响的 tools 通常需要 approval。[Microsoft Agent Safety][ms-agent-safety]

MCP tool annotations 包含 read-only、destructive、idempotent 和 open-world hints，但 MCP spec 也提醒客户端不能信任来自不可信服务器的 annotations；OpenAI remote MCP tools 支持 `require_approval`；Amazon Bedrock action group schemas 也支持 `requireConfirmation` 作为对 prompt injection 的防护。[MCP Tools Spec][mcp-tools-spec][OpenAI API Tools][openai-api-tools][AWS Bedrock Action Groups][aws-bedrock-action-groups]

所以，破坏性、外部、不可逆、付费、隐私敏感或广泛影响的动作，不应该作为 quiet skill script 自动执行。它们应该进入带 approval metadata、runtime gate、audit 和 retry 语义的 tool / workflow 边界。[Microsoft Agent Safety][ms-agent-safety][Microsoft Workflows][ms-workflows][Apple Tool Calling][apple-tool-calling]

## 5.12 CLI / Python package：Skill 的“肉身”

一个成熟 Skill 可以把执行部分交给本地 CLI 或 Python package，而不是把长代码嵌在 instructions 里。Agent Skills spec 的 `scripts/`、Anthropic 的 Python helper 例子、AWS Agent Toolkit 的 deterministic code scripts、Microsoft 的 `run_skill_script` 都支持这种方向。[Agent Skills Spec][agent-skills-spec][Anthropic Agent Skills][anthropic-agent-skills][AWS Agent Toolkit Skills][aws-agent-toolkit-skills][Microsoft Agent Skills][ms-agent-skills]

如果一个 Skill 的 executable body 超过小脚本，建议把它做成 tested CLI / Python package，并提供稳定命令表面。此时 Skill 变成 agent-facing manual：什么时候调用、准备什么输入、输出如何解释、失败如何恢复。[Agent Skills Spec][agent-skills-spec][Microsoft Agent Skills][ms-agent-skills]

这就是第一章提到的“双重身份”的工程版本：Skill 的生态包装是 agent-facing instructions；它的物理执行可以是脚本、CLI、Python package、tool、MCP server 或 plugin bundle。[Agent Skills Spec][agent-skills-spec][OpenAI Plugins][openai-plugins][Volcengine AgentKit][volcengine-agentkit]

但这仍然不是默认起点。先从清晰 `SKILL.md` 开始，只有当可靠性、复用、测试或分发需求真实出现时，才给 Skill 增加“肉身”。[Anthropic Agent Skills][anthropic-agent-skills][OpenAI Skills][openai-skills]

## 5.13 本章检查清单

决定能力边界时，按这个顺序问：

- 缺的是方法吗？如果是，写进 `SKILL.md`。
- 缺的是深度资料吗？如果是，放进 `references/`。
- 缺的是产物材料吗？如果是，放进 `assets/`。
- 缺的是本地确定性执行吗？如果是，放进 `scripts/`。
- 需要稳定 schema、runtime context、跨 agent 复用或 API 级测试吗？如果是，升级为 tool。
- 需要标准发现、远程调用、授权、聚合或跨客户端复用吗？如果是，升级为 MCP。
- 需要 OAuth、scopes、admin provisioning 或外部 SaaS / 企业系统连接吗？如果是，使用 connector。
- 需要固定步骤、checkpoint、retry、human approval 或副作用控制吗？如果是，升级为 workflow。
- 需要安装、发布、marketplace、workspace distribution 或多个能力组合吗？如果是，打包为 plugin / capability bundle。

这份检查清单是本教程对 OpenAI、Anthropic、Agent Skills spec、Microsoft、MCP、AWS、Alibaba、Tencent、xAI 和 Apple 等资料的边界归纳，用来避免两个极端：把所有事情都藏进 prompt，或者把每个 Skill 都做成小平台。[OpenAI Skills][openai-skills][Anthropic Agent Skills][anthropic-agent-skills][Agent Skills Spec][agent-skills-spec][Microsoft Agent Skills][ms-agent-skills][MCP Tools Spec][mcp-tools-spec][AWS AgentCore Gateway][aws-agentcore-gateway]

## 本章小结

第五章的核心结论是：Skill 应该是完成任务所需的最小能力包。它先教 agent 如何工作；当需要确定性执行时加 scripts；当需要 schema、权限、审计、跨系统或过程治理时，才升级到 tool、MCP、connector、workflow 或 plugin。[Agent Skills Spec][agent-skills-spec][OpenAI Skills][openai-skills][Microsoft Agent Skills][ms-agent-skills]

专业不是把所有边界都做重，而是在正确位置建立正确边界。下一章将讨论如何验证这些边界真的可靠：activation 是否正确、正文是否被遵循、资源和脚本是否按预期使用、输出是否稳定，以及真实失败如何进入回归测试。[Anthropic Agent Skills][anthropic-agent-skills][Microsoft Agent Safety][ms-agent-safety][OpenAI API Tools][openai-api-tools]

## Sources

- [Agent Skills Spec][agent-skills-spec]
- [Anthropic Agent Skills][anthropic-agent-skills]
- [OpenAI Skills][openai-skills]
- [OpenAI Plugins][openai-plugins]
- [OpenAI Plugin Guidance][openai-plugin-guidance]
- [OpenAI Apps][openai-apps]
- [OpenAI API Tools][openai-api-tools]
- [OpenAI Function Calling][openai-function-calling]
- [Microsoft Agent Skills][ms-agent-skills]
- [Microsoft Function Tools][ms-function-tools]
- [Microsoft Workflows][ms-workflows]
- [Microsoft Agent Safety][ms-agent-safety]
- [MCP Tools Spec][mcp-tools-spec]
- [MCP Authorization][mcp-authorization]
- [AWS AgentCore Gateway][aws-agentcore-gateway]
- [AWS Agent Toolkit Skills][aws-agent-toolkit-skills]
- [AWS Bedrock Action Groups][aws-bedrock-action-groups]
- [AWS Code Interpreter][aws-code-interpreter]
- [Alibaba Custom Plugins][alibaba-custom-plugins]
- [Alibaba MCP][alibaba-mcp]
- [Alibaba Workflow][alibaba-workflow]
- [Tencent ADP][tencent-adp]
- [Volcengine AgentKit][volcengine-agentkit]
- [xAI Function Calling][xai-function-calling]
- [xAI Structured Outputs][xai-structured-outputs]
- [xAI Connectors][xai-connectors]
- [xAI Connector Management][xai-connector-management]
- [Apple Foundation Models][apple-foundation-models]
- [Apple Tool Calling][apple-tool-calling]
- [Apple Intelligence][apple-intelligence]
- [Apple App Intents][apple-app-intents]
- [Claude Code Permissions][claude-code-permissions]

[agent-skills-spec]: https://github.com/agentskills/agentskills/blob/main/docs/specification.mdx
[anthropic-agent-skills]: https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
[openai-skills]: https://help.openai.com/en/articles/20001066
[openai-plugins]: https://help.openai.com/en/articles/20001256
[openai-plugin-guidance]: https://github.com/openai/plugins/blob/main/.agents/skills/plugin-creator/SKILL.md
[openai-apps]: https://help.openai.com/en/articles/11487775-connectors-in-chatgpt?domain=C&host=D&subdomain=B
[openai-api-tools]: https://platform.openai.com/docs/api-reference/evals/deleteRun?lang=python
[openai-function-calling]: https://help.openai.com/en/articles/8555517
[ms-agent-skills]: https://learn.microsoft.com/en-us/agent-framework/agents/skills
[ms-function-tools]: https://learn.microsoft.com/en-us/agent-framework/agents/tools/function-tools
[ms-workflows]: https://learn.microsoft.com/en-us/agent-framework/workflows/
[ms-agent-safety]: https://learn.microsoft.com/en-us/agent-framework/agents/safety
[mcp-tools-spec]: https://modelcontextprotocol.io/specification/2025-06-18/server/tools
[mcp-authorization]: https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization
[aws-agentcore-gateway]: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway.html
[aws-agent-toolkit-skills]: https://docs.aws.amazon.com/agent-toolkit/latest/userguide/skills.html
[aws-bedrock-action-groups]: https://docs.aws.amazon.com/bedrock/latest/userguide/agents-action-add.html
[aws-code-interpreter]: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-tool.html
[alibaba-custom-plugins]: https://www.alibabacloud.com/help/en/model-studio/custom-plug-ins
[alibaba-mcp]: https://help.aliyun.com/zh/model-studio/mcp-introduction
[alibaba-workflow]: https://help.aliyun.com/zh/model-studio/workflow-application/
[tencent-adp]: https://adp.tencent.com/zh/document/%E4%BA%A7%E5%93%81%E7%AE%80%E4%BB%8B/%E4%BA%A7%E5%93%81%E6%A6%82%E8%BF%B0
[volcengine-agentkit]: https://volcengine.github.io/agentkit-sdk-python/en/content/1.introduction/1.overview.html
[xai-function-calling]: https://docs.x.ai/developers/tools/function-calling
[xai-structured-outputs]: https://docs.x.ai/developers/model-capabilities/text/structured-outputs
[xai-connectors]: https://docs.x.ai/grok/connectors
[xai-connector-management]: https://docs.x.ai/grok/connector-management
[apple-foundation-models]: https://developer.apple.com/documentation/foundationmodels/
[apple-tool-calling]: https://developer.apple.com/documentation/foundationmodels/expanding-generation-with-tool-calling
[apple-intelligence]: https://developer.apple.com/apple-intelligence/
[apple-app-intents]: https://developer.apple.com/documentation/appintents/app-intents
[claude-code-permissions]: https://code.claude.com/docs/en/permissions
