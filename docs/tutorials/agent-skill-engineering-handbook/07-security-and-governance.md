# 第七章 Security and Governance：不要让 Skill 变成隐藏的特权代码

## 本章证据底座

本章主要综合 Agent Skills specification、OpenAI Skills / Plugins / plugin security、Claude Code Security / Skills / Settings / Hooks、Microsoft Agent Framework safety / skills / workflows、AWS AgentCore Gateway / Policy / Registry / Observability、Alibaba Model Studio、Tencent ADP、Volcengine AgentKit、xAI Grok Connectors、Apple App Intents / Private Cloud Compute 等官方或一手资料，用来讨论 Skill、plugin、connector、MCP、tool、workflow 的信任、权限和治理边界。[Agent Skills Spec][agent-skills-spec][OpenAI Skills][openai-skills][OpenAI Plugins][openai-plugins][OpenAI Plugin Security][openai-plugin-security][Claude Code Security][claude-code-security][Microsoft Agent Safety][ms-agent-safety]

第六章已经说明，Skill 必须被测试。第七章继续向前一步：当 Skill 可以注入指令、读取资源、运行 scripts、调用 tools、配置 MCP server、连接外部系统或进入组织分发时，它就应该像 dependency package 一样治理，而不是像普通提示词一样信任。[Agent Skills Spec][agent-skills-spec][Microsoft Agent Skills][ms-agent-skills][OpenAI Plugin Security][openai-plugin-security]

## 7.1 Skill 不是无害文本

Agent Skills spec 定义的 skill 可以包含 `SKILL.md`、`scripts/`、`references/`、`assets/`；`description` 参与发现和调用，scripts 让包具备可执行能力，resources 会扩展 agent 在任务中读取的内容。[Agent Skills Spec][agent-skills-spec]

Microsoft 明确提醒，Agent Skills 应像第三方代码一样被审查，因为 instructions 会进入 agent context，scripts 可以执行代码；OpenAI skill-creator guidance 也把 skills 描述为包含 instructions、scripts、references、assets 的 self-contained folders。[Microsoft Agent Skills][ms-agent-skills][OpenAI Skill Creator][openai-skill-creator]

因此，Skill 的安全问题不只是“提示词写得好不好”。它可能改变 agent 的行为、扩大上下文、引导工具调用、执行本地代码、或把外部数据当成操作依据。[Microsoft Agent Safety][ms-agent-safety][Claude Code Security][claude-code-security]

本章的核心规则是：

> 不要让 Skill 成为隐藏的特权代码。

这句话是本教程对 OpenAI、Claude Code、Microsoft、AWS、Tencent、Alibaba、Volcengine、xAI 和 Apple 资料的治理归纳。[OpenAI Plugin Security][openai-plugin-security][Claude Code Security][claude-code-security][Microsoft Agent Safety][ms-agent-safety][AWS AgentCore Policy][aws-agentcore-policy][Tencent ADP Skills][tencent-adp-skills]

## 7.2 Capability 和 Authority 必须分开

Skill 可以教 agent 怎么做，但不应该自己成为权限边界。OpenAI plugin model 区分 skills、apps 和 plugins：apps / connectors 连接外部工具、数据和动作；plugin 可以打包 skills 和 apps，但 app permissions 仍然由源系统、RBAC、读写动作、确认要求、sync / domain restrictions 等控制。[OpenAI Plugins][openai-plugins][OpenAI Admin Controls][openai-admin-controls]

Claude Code 的 `allowed-tools` 可以在 skill 活跃期间预批准列出的工具，但 baseline permission settings 仍然治理其它工具；Claude Code 也支持 deny `Skill` tool、allow / deny 特定 skills，以及用 `disable-model-invocation` 隐藏某些 skill 的模型自动调用。[Claude Code Skills][claude-code-skills]

Microsoft 同样区分 tools 和 skills：tools 是 callable actions，skills 是知识和资源包；当副作用、重试、审批或确定性执行重要时，Microsoft 建议使用 workflows，而不是只靠 skill instructions。[Microsoft Adding Skills][ms-adding-skills][Microsoft Agent Skills][ms-agent-skills][Microsoft Workflows][ms-workflows]

本教程把这条边界写成：

> Skill teaches; platform authorizes; tool executes; workflow governs; audit records.

这是对 OpenAI、Claude Code 和 Microsoft 治理模型的工程化归纳。[OpenAI Plugins][openai-plugins][Claude Code Skills][claude-code-skills][Microsoft Agent Skills][ms-agent-skills]

## 7.3 Prompt injection 要当成 tool-authorization 问题

Prompt injection 不是只靠一句“不要被注入”就能解决。OpenAI plugin security guidance 明确要求开发者假设 prompt injection 和恶意输入会到达 server，必须验证每个输入、保留 audit logs，并对不可逆操作要求 human confirmation。[OpenAI Plugin Security][openai-plugin-security]

Claude Code security 文档描述了多层防护：敏感操作需要明确审批，抓取网页内容的命令默认不会自动批准，web fetch 使用隔离上下文，疑似 shell 命令即使 allowlisted 也需要人工审批，未匹配命令 fail closed 到 manual approval，新 codebase 或新 MCP server 首次使用需要 trust verification。[Claude Code Security][claude-code-security]

Microsoft Agent Safety 提醒，tools、context providers、RAG 和 chat history 中的数据可能包含 adversarial instructions；它建议把 LLM 生成的 tool arguments 当作不可信输入，用 allow-list validation，不要把 end-user input 放进 system-role messages，并在渲染或执行前 sanitize 输出。[Microsoft Agent Safety][ms-agent-safety]

所以，Skill 安全设计要把 retrieved documents、web pages、issue comments、emails、tool outputs、PDF 内容都视为 untrusted data，而不是 instructions。真正的控制要在 server-side validation、tool allowlist、approval、gateway policy 和 audit logs 中实现。[OpenAI Plugin Security][openai-plugin-security][Microsoft Agent Safety][ms-agent-safety][AWS AgentCore Policy][aws-agentcore-policy]

## 7.4 Scripts、hooks 和 shell 必须沙箱化

Skill scripts 是代码，不是注释。Microsoft Agent Skills security guidance 建议用 containers、`seccomp`、`firejail` 等方式 sandbox scripts，并设置 CPU、memory、wall-clock limits、executable allow-lists 和 usage logging；它还说明 remote archive type MCP skills 不执行 bundled scripts，这是有意的安全边界。[Microsoft Agent Skills][ms-agent-skills]

Claude Code 默认对文件编辑、测试运行和命令执行要求显式权限，并支持 Bash sandboxing、filesystem / network isolation、working-directory write boundaries 和 prompt-fatigue mitigations。[Claude Code Security][claude-code-security]

Claude Code hooks 文档还提醒，command hooks 会以用户完整权限执行 shell commands，可以访问、修改或删除用户账户能访问的任何文件。[Claude Code Hooks][claude-code-hooks]

因此，企业级 Skill 不能把 hooks、shell scripts、install scripts、MCP configs 当作普通资源审查。它们应该进入代码审查、依赖审查、沙箱配置、日志和回滚机制。[Claude Code Hooks][claude-code-hooks][Microsoft Agent Skills][ms-agent-skills][OpenAI Package Plugin][openai-package-plugin]

## 7.5 Tool allow / deny 应 fail closed

Claude Code 支持 `--allowedTools`、`--disallowedTools`、permission modes 和 custom permission prompt tool；SDK 文档说明 MCP tools 需要显式允许，permissions 会从 settings 和 CLI flags 检查，再 fallback 到 permission prompt tool。[Claude Code CLI][claude-code-cli][Claude Code SDK][claude-code-sdk]

Claude Code settings 还支持 managed permission controls，例如 `allowManagedPermissionRulesOnly`、`allowedMcpServers`、`deniedMcpServers`、`allowManagedMcpServersOnly`、`disableBundledSkills`、`disableSkillShellExecution`、marketplace restrictions 和 managed-only hooks。[Claude Code Settings][claude-code-settings]

OpenAI model guidance 建议定义 autonomy 和 approval boundaries，对外部写入、破坏性动作、购买或实质性范围扩大要求确认，并且只暴露与任务相关的 tools。[OpenAI Model Guidance][openai-model-guidance]

本教程建议：shell、browser automation、SQL、cloud control plane、execute code、deployment、messaging、payment 等 broad tools 默认不要被 Skill 静默启用。没有匹配到明确 allow rule 的工具，应要求确认或拒绝。[Claude Code Settings][claude-code-settings][OpenAI Model Guidance][openai-model-guidance]

## 7.6 Credentials 不属于 Skill 文件

OpenAI plugin security guidance 建议使用 OAuth 2.1 authorization-code flow，验证并执行 scopes，对过期或畸形 token 返回 `401`，并避免在有内置 identity 时存储长期 secrets。[OpenAI Plugin Security][openai-plugin-security]

OpenAI plugin administration guidance 也说明，ChatGPT 中批准 app 不会覆盖源系统权限；如果用户在连接服务中不能访问某个 file、repo、record、workspace 或 channel，plugin 不应该通过 Codex 或 ChatGPT 提供访问。[OpenAI Plugins][openai-plugins][OpenAI Admin Controls][openai-admin-controls]

AWS AgentCore Gateway 支持 IAM SigV4、caller IAM credentials、OAuth JWT 和 token passthrough；Volcengine Agent Identity 通过 agent IAM role 和 OAuth user authorization 让 agent 获取访问凭证；xAI Grok connectors 对内置 connectors 使用 OAuth，Business / Enterprise 还要求 team admin provisioning。[AWS Runtime Targets][aws-runtime-targets][Volcengine Agent Identity][volcengine-agent-identity][xAI Connectors][xai-connectors]

所以，API keys、OAuth tokens、cloud credentials、database passwords、cookie、session tokens 不应该写进 `SKILL.md`、references、assets 或 scripts。它们应存在 connector identity systems、secret managers、platform auth contexts 或 workload identity 中。[OpenAI Plugin Security][openai-plugin-security][Alibaba Single Agent][alibaba-single-agent][AWS Identity Observability][aws-identity-observability]

## 7.7 Governance 应放在 gateway 或 runtime

AWS AgentCore Policy 把安全控制放到 Gateway：policy engines 拦截 agent requests，在允许 tool access 之前进行 deterministic policy evaluation；policies 可以在 `LOG_ONLY` 或 `ENFORCE` 模式运行，决策记录到 CloudWatch metrics 和 logs。[AWS AgentCore Policy][aws-agentcore-policy][AWS Gateway Policy][aws-gateway-policy]

AWS 还建议用 AgentCore Gateway 作为 governed entry point，集中处理 policy authorization、guardrails、request / response interceptors 和 unified observability，并限制 direct runtime invocation，防止绕过 gateway。[AWS Runtime OAuth][aws-runtime-oauth][AWS Runtime Targets][aws-runtime-targets]

Tencent ADP 则用 enterprise / workspace / application 层次管理身份、资源共享、隔离和具体 agent 能力，并支持 workspace member、role、functional permissions、data permissions、view / edit permissions 和 advanced custom operation permissions。[Tencent ADP Architecture][tencent-adp-architecture][Tencent ADP Permissions][tencent-adp-permissions]

这说明治理不应该只写在 Skill 文本里。Skill 可以声明期望行为，但最终 enforcement 应在 host runtime、gateway、connector、IAM、RBAC、policy engine 和 audit layer 中完成。[AWS AgentCore Policy][aws-agentcore-policy][Tencent ADP Permissions][tencent-adp-permissions]

## 7.8 Enterprise distribution 需要 admin-managed channel

OpenAI ChatGPT Skills 支持 workspace permissions：启用 skills、上传、分享、发布到 workspace、为他人安装；Admin Skills page 还显示 owner、access、users、invocations、created / updated，并允许管理员下载、改 access、改 owner 或删除 skill。[OpenAI Skills][openai-skills]

OpenAI plugin administration 在 Enterprise / Edu 中默认禁用 plugins 和 underlying apps，由管理员分别管理 plugin installation 和 app access，并使用 RBAC 管理 roles / groups。[OpenAI Admin Controls][openai-admin-controls]

Claude Code marketplaces 提供 centralized plugin discovery、version tracking、auto-updates 和 git / local / npm sources；plugin dependency versions 也能避免 upstream plugin 改变后 dependent plugins 静默失效。[Claude Plugin Marketplaces][claude-plugin-marketplaces][Claude Plugin Dependencies][claude-plugin-dependencies]

Tencent ADP Skills 分 built-in、custom imported 和 enterprise-shared。Built-in skills 经过官方 security / quality checks；custom skill import 触发 format validation 和 security scanning；enterprise sharing 需要 enterprise admins approval 并复用之前 security report。[Tencent ADP Skills][tencent-adp-skills]

因此，企业 Skill 不应该通过聊天复制、网盘压缩包或个人路径临时分发。它应该通过 admin-managed catalog、workspace publishing、marketplace、pinned version、approval 和 audit trail 管理。[OpenAI Skills][openai-skills][Claude Plugin Marketplaces][claude-plugin-marketplaces][Tencent ADP Skills][tencent-adp-skills]

## 7.9 Apple PCC 给出的隐私治理标尺

Apple 没有使用 Agent Skill 包概念，但 App Intents 和 Private Cloud Compute 提供了 AI capability exposure 的安全标尺。App Intents 用 schema 让 app content 和 capabilities 通过自然语言可用；PCC 则强调 stateless computation、no privileged runtime access、non-targetability、verifiable transparency 和 no admin data access。[Apple Intelligence][apple-intelligence][Apple PCC Security Guide][apple-pcc-security]

PCC 还使用 attestation：用户设备只会把数据释放给运行公开记录软件 measurements 的 nodes；PCC Software Foundations 描述了禁用动态代码执行机制、immutable runtime software、per-boot data erasure 和 anti-persistence protections。[Apple PCC Hardware Root][apple-pcc-hardware-root][Apple PCC Software Foundations][apple-pcc-software-foundations]

对 Skill 手册来说，Apple 的启发不是“所有 Skill 都要实现 PCC”，而是：任何声称 private cloud、secure runtime 或 enterprise-grade governance 的平台，都应提供可执行的技术控制，而不是只给政策承诺。[Apple PCC Security Guide][apple-pcc-security][Apple PCC Software Layering][apple-pcc-software-layering]

## 7.10 避免 hidden privileged code 的检查清单

评审一个 Skill、plugin、connector、MCP server 或 workflow bundle 时，至少检查：

- 包含哪些文件：instructions、scripts、resources、assets、hooks、MCP config、app mappings、marketplace metadata。
- 谁拥有它，谁批准它，source of truth 在哪里。
- 是否有版本、签名、pinned commit 或 reviewed release。
- 是否包含 executable code、install logic 或 lifecycle hooks。
- 是否依赖其它 plugins、packages、MCP servers、APIs 或 registries。
- 模型能自动调用，还是只能用户显式调用。
- 是否有 tool allow / deny rule。
- 是否有 write-capable、destructive、external、costly、regulated actions。
- 是否通过 OAuth、source-system ACL、workload identity 或 secret manager 管理 credentials。
- scripts 是否 sandboxed，是否有 CPU / memory / time / filesystem / network limits。
- 是否记录 skill loads、resource reads、script runs、tool calls、connector calls、approvals、denials、policy decisions 和 identities。

这份清单是本教程对 OpenAI、Claude Code、Microsoft、AWS、Tencent、Alibaba、Volcengine、xAI、Apple 等资料的安全治理归纳，用来防止 Skill 从“可读工作流”滑向“不透明特权包”。[OpenAI Plugin Security][openai-plugin-security][Claude Code Security][claude-code-security][Microsoft Agent Safety][ms-agent-safety][AWS AgentCore Policy][aws-agentcore-policy][Tencent ADP Skills][tencent-adp-skills][Volcengine AgentKit][volcengine-agentkit]

## 本章小结

第七章的核心结论是：Skill 可以携带方法，但不能私自携带权力。一个成熟 Skill 应该低权限、可审查、可测试；真正的 authority 应由 host controls、tool allow / deny、OAuth scopes、MCP registration、gateway policy、human approvals、sandbox 和 audit logs 执行。[OpenAI Admin Controls][openai-admin-controls][Claude Code Settings][claude-code-settings][Microsoft Agent Safety][ms-agent-safety][AWS AgentCore Policy][aws-agentcore-policy]

危险的设计相反：宽泛自动触发、隐藏脚本、广泛工具权限、硬编码 secrets、未审查依赖、无沙箱、无审批、无日志。那不是 pro-level Skill，而是披着自然语言外衣的 privileged code。[OpenAI Plugin Security][openai-plugin-security][Claude Code Hooks][claude-code-hooks][Microsoft Agent Skills][ms-agent-skills]

下一章将讨论 lifecycle and maintenance：当 Skill 已经通过评估和治理进入使用后，如何管理版本、owner、review gates、stale-content sweep、rollback、deprecation 和 migration。

## Sources

- [Agent Skills Spec][agent-skills-spec]
- [OpenAI Skills][openai-skills]
- [OpenAI Plugins][openai-plugins]
- [OpenAI Admin Controls][openai-admin-controls]
- [OpenAI Plugin Security][openai-plugin-security]
- [OpenAI Skill Creator][openai-skill-creator]
- [OpenAI Package Plugin][openai-package-plugin]
- [OpenAI Model Guidance][openai-model-guidance]
- [Claude Code Security][claude-code-security]
- [Claude Code Settings][claude-code-settings]
- [Claude Code Hooks][claude-code-hooks]
- [Claude Code Skills][claude-code-skills]
- [Claude Code CLI][claude-code-cli]
- [Claude Code SDK][claude-code-sdk]
- [Claude Plugin Marketplaces][claude-plugin-marketplaces]
- [Claude Plugin Dependencies][claude-plugin-dependencies]
- [Microsoft Agent Safety][ms-agent-safety]
- [Microsoft Agent Skills][ms-agent-skills]
- [Microsoft Adding Skills][ms-adding-skills]
- [Microsoft Workflows][ms-workflows]
- [AWS AgentCore Policy][aws-agentcore-policy]
- [AWS Gateway Policy][aws-gateway-policy]
- [AWS Runtime Targets][aws-runtime-targets]
- [AWS Runtime OAuth][aws-runtime-oauth]
- [AWS Identity Observability][aws-identity-observability]
- [Alibaba Single Agent][alibaba-single-agent]
- [Tencent ADP Architecture][tencent-adp-architecture]
- [Tencent ADP Permissions][tencent-adp-permissions]
- [Tencent ADP Skills][tencent-adp-skills]
- [Volcengine AgentKit][volcengine-agentkit]
- [Volcengine Agent Identity][volcengine-agent-identity]
- [xAI Connectors][xai-connectors]
- [xAI Connector Management][xai-connector-management]
- [Apple Intelligence][apple-intelligence]
- [Apple PCC Security Guide][apple-pcc-security]
- [Apple PCC Hardware Root][apple-pcc-hardware-root]
- [Apple PCC Software Foundations][apple-pcc-software-foundations]
- [Apple PCC Software Layering][apple-pcc-software-layering]

[agent-skills-spec]: https://github.com/agentskills/agentskills/blob/main/docs/specification.mdx
[openai-skills]: https://help.openai.com/en/articles/20001066-skills-in-chatgpt/
[openai-plugins]: https://help.openai.com/en/articles/20001256-plugins-in-codex/
[openai-admin-controls]: https://help.openai.com/en/articles/11509118-admin-controls-security-and-compliance-in-connectors-enterprise-edu-and-team
[openai-plugin-security]: https://developers.openai.com/plugins/guides/security-privacy
[openai-skill-creator]: https://github.com/openai/skills/blob/main/skills/.system/skill-creator/SKILL.md
[openai-package-plugin]: https://developers.openai.com/plugins/build/plugins
[openai-model-guidance]: https://developers.openai.com/api/docs/guides/latest-model
[claude-code-security]: https://docs.anthropic.com/en/docs/claude-code/security
[claude-code-settings]: https://docs.anthropic.com/en/docs/claude-code/settings
[claude-code-hooks]: https://docs.anthropic.com/en/docs/claude-code/hooks
[claude-code-skills]: https://code.claude.com/docs/en/skills
[claude-code-cli]: https://docs.anthropic.com/en/docs/claude-code/cli-usage
[claude-code-sdk]: https://docs.anthropic.com/en/docs/claude-code/sdk
[claude-plugin-marketplaces]: https://code.claude.com/docs/en/plugin-marketplaces
[claude-plugin-dependencies]: https://code.claude.com/docs/en/plugin-dependencies
[ms-agent-safety]: https://learn.microsoft.com/en-us/agent-framework/agents/safety
[ms-agent-skills]: https://learn.microsoft.com/en-us/agent-framework/agents/skills
[ms-adding-skills]: https://learn.microsoft.com/en-us/agent-framework/journey/adding-skills
[ms-workflows]: https://learn.microsoft.com/en-us/agent-framework/journey/workflows
[aws-agentcore-policy]: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy.html
[aws-gateway-policy]: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-create-api.html
[aws-runtime-targets]: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-http-runtime.html
[aws-runtime-oauth]: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-oauth.html
[aws-identity-observability]: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-identity-metrics.html
[alibaba-single-agent]: https://help.aliyun.com/zh/model-studio/new-single-agent-application
[tencent-adp-architecture]: https://cloud.tencent.com/document/product/1759/104194
[tencent-adp-permissions]: https://cloud.tencent.com/document/product/1759/122574
[tencent-adp-skills]: https://cloud.tencent.com/document/product/1759/129561
[volcengine-agentkit]: https://www.volcengine.com/product/agentkit
[volcengine-agent-identity]: https://www.volcengine.com/docs/86848/2123359
[xai-connectors]: https://docs.x.ai/grok/connectors
[xai-connector-management]: https://docs.x.ai/grok/connector-management
[apple-intelligence]: https://developer.apple.com/apple-intelligence/
[apple-pcc-security]: https://security.apple.com/documentation/private-cloud-compute/
[apple-pcc-hardware-root]: https://security.apple.com/documentation/private-cloud-compute/hardwarerootoftrust
[apple-pcc-software-foundations]: https://security.apple.com/documentation/private-cloud-compute/softwarefoundations
[apple-pcc-software-layering]: https://security.apple.com/documentation/private-cloud-compute/softwarelayering
