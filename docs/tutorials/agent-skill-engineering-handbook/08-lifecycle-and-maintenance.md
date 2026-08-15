# 第八章 Lifecycle and Maintenance：让 Skill 成为可持续演进的能力资产

## 本章证据底座

本章主要综合 Agent Skills specification、Agent Skills evaluation / best practices、OpenAI Skills / Plugins / admin controls、Claude Code Skills / Plugins / marketplace / settings、Microsoft Agent Framework、AWS AgentCore Runtime / Gateway / Observability / Evaluations、Alibaba Model Studio、Tencent ADP、Volcengine AgentKit、xAI API docs、Apple Foundation Models / App Intents / PCC 等官方或一手资料，用来讨论 Skill 上线之后如何被版本化、维护、回滚、废弃和迁移。[Agent Skills Spec][agent-skills-spec][Agent Skills Evaluation][agent-skills-evaluation][Agent Skills Best Practices][agent-skills-best-practices][OpenAI Skills][openai-skills][OpenAI Plugins][openai-plugins][Claude Code Skills][claude-code-skills]

第六章讲“如何验证”，第七章讲“如何治理”。第八章讲的是更长期的问题：当 Skill 已经进入个人、项目、workspace 或企业使用后，如何防止它变旧、失控、无人维护，或者在平台变化后静默退化。[Microsoft Agent Skills][ms-agent-skills][AWS AgentCore Observability][aws-agentcore-observability][Alibaba Observation][alibaba-observation][Tencent AgentOps][tencent-agentops]

## 8.1 Skill 是行为依赖，不是静态文档

Skill 会改变 agent 行为：它的 `description` 会影响触发，它的正文会影响执行步骤，它的 references 会影响知识依据，它的 scripts 会影响确定性执行，它的 tools / connectors / MCP / workflow 边界会影响权限和外部动作。[Agent Skills Spec][agent-skills-spec][OpenAI Skill Creator][openai-skill-creator][Microsoft Agent Skills][ms-agent-skills]

因此，一个被复用的 Skill 应被视为 behavioral dependency。它不像普通说明文档那样“写完就放着”，而应该像软件依赖一样管理：版本、owner、review gate、发布范围、兼容性、回归测试、观测、回滚和废弃路径都要明确。[OpenAI Plugins][openai-plugins][Claude Code Plugins][claude-code-plugins][Microsoft Agent Skills][ms-agent-skills]

本章的核心规则是：

> 一个没有 owner、version、eval 和 rollback path 的共享 Skill，只能算实验资产，不能算 pro-level 能力资产。

这句话是本教程对 OpenAI、Claude Code、Agent Skills evaluation、Microsoft 和 AWS lifecycle / observability 资料的工程化归纳。[OpenAI Skills][openai-skills][Claude Code Plugins][claude-code-plugins][Agent Skills Evaluation][agent-skills-evaluation][Microsoft Agent Evaluation][ms-agent-evaluation][AWS AgentCore Evaluations][aws-agentcore-evaluations]

## 8.2 先定义 lifecycle object

维护之前，必须先定义要维护的对象。一个 `SKILL.md` 文件、一个 plugin package、一个 MCP server、一个 connector、一个 cloud gateway target、一个 workflow application，有不同的 owner、review gate、rollback path 和风险。[Agent Skills Spec][agent-skills-spec][OpenAI Package Plugin][openai-package-plugin][Microsoft Agent Skills][ms-agent-skills][AWS AgentCore Gateway][aws-agentcore-gateway]

本教程建议为每个能力包记录：

- package id。
- display name。
- owner 和 backup owner。
- source repository。
- distribution scope。
- current version。
- dependency constraints。
- last-reviewed date。
- allowed tools / connectors。
- rollback procedure。
- status：experimental、active、deprecated、retired、disabled。

Agent Skills spec 提供 portable skill directory baseline，但它本身不解决 release management；因此团队可以在 package metadata、相邻 manifest 或内部 registry 中补充 lifecycle metadata，只要不破坏目标平台解析。[Agent Skills Spec][agent-skills-spec]

## 8.3 版本化：记录行为变化，而不是只记录文件变化

Claude Code plugins 有 version、marketplace installation、update 和 dependency 机制；OpenAI Codex plugins 也是 installable packages，可以包含 skills、apps、app templates、MCP configuration、hooks 和 assets。[Claude Code Plugins][claude-code-plugins][Claude Plugin Marketplace][claude-plugin-marketplace][OpenAI Package Plugin][openai-package-plugin]

这意味着版本号不应该只反映“文件有没有改”。Skill 的行为表面包括 activation、正文、references、scripts、tools、connectors、permissions、dependencies 和 output contract。[Agent Skills Spec][agent-skills-spec][Agent Skills Evaluation][agent-skills-evaluation]

本教程建议用行为语义来理解版本：

- `MAJOR`：不兼容的 activation、workflow、tool contract、schema、permission 或 output contract 变化。
- `MINOR`：新增兼容场景、新 optional reference / script、新安全支持或新工具使用。
- `PATCH`：错别字、澄清、窄 bug fix、fixture 更新、stale link 替换。

如果修改了 `description`，那是 routing behavior change；如果修改了 required script，那是 execution behavior change；如果修改了 allowed connector，那是 permission / data-access behavior change。[Agent Skills Description Optimization][agent-skills-description-optimization][Microsoft Agent Skills][ms-agent-skills][OpenAI Admin Controls][openai-admin-controls]

## 8.4 发布范围就是 lifecycle state

OpenAI Skills 支持创建、上传、分享、发布到 workspace 和管理员控制；OpenAI admin controls 还区分 plugin / app access、Enterprise / Edu 默认、RBAC 和组权限。[OpenAI Skills][openai-skills][OpenAI Admin Controls][openai-admin-controls]

Claude Code plugin marketplaces 提供 centralized discovery、version tracking、auto-updates 和不同 source types；Claude Code settings 也区分 user、project 和 enterprise-managed settings。[Claude Plugin Marketplace][claude-plugin-marketplace][Claude Code Settings][claude-code-settings]

因此，Skill 的 distribution scope 本身就是生命周期状态：

- `personal`：个人实验或个人效率工具。
- `project`：仓库或应用团队共享。
- `workspace`：更大内部群体批准使用。
- `enterprise`：中央审核、可发现、可监控、可支持。
- `public marketplace`：对外发布、文档化、版本化、支持化。

每次扩大 scope，都应该经过更严格的 gate：activation tests、body-following tests、tool-call / process tests、security review、owner assignment、release notes 和 rollback planning。[Agent Skills Evaluation][agent-skills-evaluation][OpenAI Admin Controls][openai-admin-controls][Tencent ADP Skills][tencent-adp-skills]

## 8.5 Review gates：每次修改前问清楚改了什么

Skill change review 不应该只问“Markdown 有没有写错”。应该先分类这次改动影响哪个行为面。[Microsoft Agent Skills][ms-agent-skills][OpenAI Plugin Security][openai-plugin-security]

每次修改前至少问：

- 是否改变 activation？
- 是否改变正文步骤？
- 是否新增或删除 reference / asset / script？
- 是否改变 tool、MCP、connector 或 workflow 边界？
- 是否改变权限、OAuth scopes、allowed tools、sandbox 或 approval？
- 是否改变输出格式或 artifact contract？
- 是否改变模型、运行时、依赖、外部 API 或平台版本假设？

Claude Code settings / security、OpenAI admin controls / plugin security、Microsoft skill security 都说明，权限、工具、脚本、连接器、工作流和外部系统不能只作为文本改动看待；它们是治理边界。[Claude Code Security][claude-code-security][Claude Code Settings][claude-code-settings][OpenAI Admin Controls][openai-admin-controls][Microsoft Agent Skills][ms-agent-skills]

因此，review gate 的输出应是明确决定：approve、request changes、pilot only、disable model invocation、require workflow boundary、require security review、or reject。

## 8.6 Changelog 要写行为变化

Claude Code plugin versioning 和 marketplace update 让 changelog 变成操作性材料：用户需要知道更新前后行为有什么变化，维护者也需要在事故排查时追溯行为来源。[Claude Code Plugins][claude-code-plugins][Claude Plugin Marketplace][claude-plugin-marketplace]

OpenAI plugin package 可能包含 skills、apps、templates、MCP configuration、hooks 和 assets；因此 release note 应说明每个受影响组件，而不是只写“更新插件”。[OpenAI Package Plugin][openai-package-plugin]

一个好的 Skill changelog 应包含：

- user-visible behavior changes。
- activation description changes。
- new / removed references、assets、scripts。
- new / removed tools、connectors、MCP servers。
- dependency changes。
- compatibility changes。
- security / permission changes。
- added regression cases。
- migration steps。
- rollback notes。

这能把“改了文件”转化为“行为变了什么”，也让第六章的 eval 和第七章的 governance 有可追溯依据。[Agent Skills Evaluation][agent-skills-evaluation][Microsoft Agent Evaluation][ms-agent-evaluation]

## 8.7 Feedback loop：把真实失败变成资产

OpenAI evals、Microsoft Agent Framework evaluation、AWS AgentCore Evaluations、Alibaba automatic evaluation、Tencent ADP application evaluation、Volcengine custom evaluators 都说明，agent 能力的改进应该依赖评估、观测和真实反馈，而不是只靠作者感觉。[OpenAI Evals][openai-evals][Microsoft Agent Evaluation][ms-agent-evaluation][AWS AgentCore Evaluations][aws-agentcore-evaluations][Alibaba Auto Evaluation][alibaba-auto-evaluation][Tencent ADP Evaluation][tencent-adp-evaluation][Volcengine Custom Evaluators][volcengine-custom-evaluators]

本教程建议把反馈分成三层：

- user feedback：评论、支持工单、重复人工修正、任务放弃。
- process telemetry：activation、resource loads、script runs、tool calls、approval prompts、failures、latency、token cost。
- outcome evaluation：rubric grades、factual checks、schema assertions、artifact diff checks、human review。

每条反馈应该进入四种结果之一：no-op with rationale、reference update、skill behavior update plus regression case、deprecation / migration。[Agent Skills Evaluation][agent-skills-evaluation][AWS AgentCore Observability][aws-agentcore-observability][Alibaba Observation][alibaba-observation]

Skill 不仅要看失败，也要看过度成功。一个几乎从不触发的 Skill 可能已经失效；一个过度频繁触发的 Skill 可能污染上下文或制造安全风险。[Agent Skills Description Optimization][agent-skills-description-optimization][Agent Skills Best Practices][agent-skills-best-practices]

## 8.8 Stale-content sweep：清理旧知识和沉积物

Progressive disclosure 能减少不必要加载，但不能阻止旧知识留在包里。Agent Skills spec、OpenAI skill-creator 和 Microsoft Agent Skills 都允许 Skill 包含 references、assets、scripts，这意味着陈旧内容可能藏在 Markdown、模板、脚本、依赖、外部 API 假设或 connector 权限模型里。[Agent Skills Spec][agent-skills-spec][OpenAI Skill Creator][openai-skill-creator][Microsoft Agent Skills][ms-agent-skills]

本教程建议每个 reusable Skill 都有 maintenance metadata：

```yaml
maintenance:
  owner: agent-platform
  backup_owner: developer-experience
  last_reviewed: 2026-08-15
  review_interval_days: 90
  stale_after: 2026-11-13
  source_watchlist:
    - https://docs.anthropic.com/en/docs/claude-code/plugins
    - https://developers.openai.com/plugins/build/plugins
  status: active
```

这个字段不是 Agent Skills spec 的强制字段，而是本教程针对长期维护的工程化建议。[Agent Skills Spec][agent-skills-spec]

季度 stale-content sweep 可以检查：

- broken links。
- moved / deprecated APIs。
- unused examples 和 references。
- no-owner skills。
- 最近 eval 失败或未运行的 packages。
- 重叠或冲突的 skills。
- 过期 experimental packages。

删除或合并 stale Skill 不是额外清洁工作，而是维护的一部分。一个 retired skill 应该留下 migration note，而不是继续隐形留在 discovery 面里。[Agent Skills Best Practices][agent-skills-best-practices][xAI Changelog][xai-changelog]

## 8.9 Rollback 和 emergency disable

Claude Code 支持通过 settings 和 marketplace 机制控制权限、deny tools、隐藏 skill model invocation、管理 plugin 安装；OpenAI admin controls 允许组织管理 plugin / app availability 和 permissions；AWS AgentCore 通过 runtime APIs 和 Gateway 提供平台级 disable / update 控制点。[Claude Code Skills][claude-code-skills][Claude Code Settings][claude-code-settings][Claude Code Plugins][claude-code-plugins][OpenAI Admin Controls][openai-admin-controls][AWS Runtime API][aws-runtime-api][AWS AgentCore Gateway][aws-agentcore-gateway]

每个发布的 Skill / package 都需要：

- latest known-good version。
- rollback command 或 marketplace action。
- emergency disable action。
- dependency-lock rollback path。
- owner escalation channel。
- blast-radius estimate。
- telemetry query to identify affected runs。

Emergency disable 应该有多个层级：hide from invocation、disable connector / tool、block package installation / update、revoke credentials / OAuth scopes、remove from marketplace、disable cloud runtime / gateway target。[Claude Code Settings][claude-code-settings][OpenAI Admin Controls][openai-admin-controls][AWS Runtime API][aws-runtime-api]

未经测试的 rollback 只是愿望。企业发布前应该试跑 rollback 和 disable path。[Agent Skills Evaluation][agent-skills-evaluation][AWS AgentCore Observability][aws-agentcore-observability]

## 8.10 Deprecation 和 migration

Claude Code settings scopes 和 plugin marketplaces 提供了从 local / personal 到 project / enterprise 的路径；OpenAI Codex plugin distribution 和 admin controls 也区分 personal installation、organizational availability 和 admin-governed app / plugin permissions。[Claude Code Settings][claude-code-settings][Claude Plugin Marketplace][claude-plugin-marketplace][OpenAI Plugins][openai-plugins][OpenAI Admin Controls][openai-admin-controls]

Agent Skills spec 是 portable baseline，但不能假设不同平台在 permission、script execution、marketplace、MCP behavior 上完全一致。因此迁移时要保留包形态，同时重新验证平台特有行为。[Agent Skills Spec][agent-skills-spec]

Personal 到 project 的迁移，应增加 owner、version、changelog、tests、compatibility metadata，并移除个人路径和个人 credentials。

Project 到 workspace / enterprise 的迁移，应增加 security review、dependency review、telemetry、rollback、support ownership、release notes 和 approval record，并通过 admin-managed permissions 验证 connectors / tools。

Enterprise 到 retired 的迁移，应标记 deprecated、发布 replacement package、设定 removal date、在 metadata / release notes 中加 warnings，并保留 regression history 和 incident notes。[OpenAI Admin Controls][openai-admin-controls][Tencent ADP Skills][tencent-adp-skills]

## 8.11 Model、tool、API 变化也是 release event

模型变化可能改变 activation、instruction-following、tool-call choices 和输出质量，即使 Skill 文件没有变。OpenAI evals、Microsoft evaluation、AWS Evaluations、Apple Evaluations、Alibaba automatic evaluation、Tencent ADP evaluation 和 Volcengine evaluators 都指向同一实践：底层模型或平台变化后应重新运行评估。[OpenAI Evals][openai-evals][Microsoft Agent Evaluation][ms-agent-evaluation][AWS AgentCore Evaluations][aws-agentcore-evaluations][Apple Tool Call Evaluation][apple-tool-call-evaluation][Alibaba Auto Evaluation][alibaba-auto-evaluation][Tencent ADP Evaluation][tencent-adp-evaluation][Volcengine Custom Evaluators][volcengine-custom-evaluators]

Tool / API 变化也会破坏 agent 行为。xAI function calling 和 structured outputs 把 JSON schema 作为显式接口；OpenAI plugin security 也强调 tool server 应负责 validation 和 authorization。[xAI Function Calling][xai-function-calling][xAI Structured Outputs][xai-structured-outputs][OpenAI Plugin Security][openai-plugin-security]

本教程建议把这些都视为 release-triggering events：

- default model change。
- model retirement。
- tool schema change。
- connector permission change。
- MCP server update。
- external API version change。
- OS / framework availability change。
- marketplace policy change。
- runtime / sandbox policy change。

每个 Skill 应维护 source watchlist，并有人负责追踪官方 changelog 或 docs。xAI changelog 是这类 first-party change feed 的例子；其它厂商也应使用官方文档和发布说明作为维护依据。[xAI Changelog][xai-changelog]

## 8.12 云平台里的 lifecycle 是分布式的

在 cloud agent platforms 中，Skill lifecycle 往往分散在多个对象上。AWS AgentCore 把 lifecycle primitives 分布在 Registry、Gateway、Runtime、Identity、Observability、Evaluations 中；Gateway 管外部工具访问，Identity 管认证，Observability 和 Evaluations 管反馈和质量。[AWS AgentCore Runtime][aws-agentcore-runtime][AWS AgentCore Gateway][aws-agentcore-gateway][AWS AgentCore Identity][aws-agentcore-identity][AWS AgentCore Observability][aws-agentcore-observability][AWS AgentCore Evaluations][aws-agentcore-evaluations]

Alibaba Model Studio / Bailian 的 lifecycle 则分布在 application publishing / calling、plugin、workflow、observation、automatic evaluation 和 model telemetry 中；Tencent ADP 强调 application evaluation 和 AgentOps；Volcengine AgentKit 涉及 tool creation、sandbox、evaluation 和 operations analysis。[Alibaba Application Publishing][alibaba-application-publishing][Alibaba Plugin Overview][alibaba-plugin-overview][Alibaba Workflow][alibaba-workflow][Alibaba Observation][alibaba-observation][Alibaba Auto Evaluation][alibaba-auto-evaluation][Tencent ADP Evaluation][tencent-adp-evaluation][Tencent AgentOps][tencent-agentops][Volcengine Operations Analysis][volcengine-ops-analysis]

所以，一个 cloud-backed Skill 不是只回滚 `SKILL.md` 就算回滚。它可能还依赖 gateway target、workflow、model deployment、connector permission、credential、runtime policy 和 evaluation config。[AWS AgentCore Gateway][aws-agentcore-gateway][Alibaba Workflow][alibaba-workflow]

维护时应保留 cross-reference：human-facing skill package 对应哪些 cloud artifacts。否则你可能以为 Skill 已回滚，但 gateway target 或 connector 权限仍然留在新状态。

## 8.13 本章检查清单

发布或更新 Skill / capability package 前，检查：

- 是否有 stable package id。
- 是否有 owner 和 backup owner。
- 是否有 source repository。
- 是否有 status：experimental、active、deprecated、retired、disabled。
- 是否有 version 和 changelog entry。
- 是否说明 compatibility：model、runtime、tools、connectors、MCP、API、OS / framework。
- 是否有 activation、body-following、trajectory、safety、output 和 regression tests。
- 是否记录 allowed tools、connectors、OAuth scopes、sandbox requirements。
- 是否有 telemetry dashboard 或最小观测字段。
- 是否有 latest known-good rollback version。
- 是否有 emergency disable procedure。
- 是否有 stale-review date 和 source watchlist。
- 是否有 deprecation / migration plan。

这份检查清单是本教程对 OpenAI、Claude Code、Agent Skills、Microsoft、AWS、Alibaba、Tencent、Volcengine、xAI、Apple 等资料的生命周期归纳，用来避免 Skill 成为无人维护的行为依赖。[OpenAI Plugins][openai-plugins][Claude Code Plugins][claude-code-plugins][Agent Skills Evaluation][agent-skills-evaluation][Microsoft Agent Evaluation][ms-agent-evaluation][AWS AgentCore Observability][aws-agentcore-observability]

## 本章小结

第八章的核心结论是：Skill 写出来之后不是结束，而是生命周期的开始。一个成熟 Skill 需要 owner、version、scope、review gate、eval、telemetry、changelog、rollback、disable、deprecation 和 migration。[Agent Skills Evaluation][agent-skills-evaluation][OpenAI Skills][openai-skills][Claude Code Plugins][claude-code-plugins][Microsoft Agent Skills][ms-agent-skills]

如果前七章解决的是“如何设计一个可靠 Skill”，第八章解决的就是“如何让这个 Skill 在真实使用中长期可靠”。下一章将把前八章合成一个完整案例：从 V0 minimal `SKILL.md` 逐步演进到 pro-level Skill / capability package。

## Sources

- [Agent Skills Spec][agent-skills-spec]
- [Agent Skills Evaluation][agent-skills-evaluation]
- [Agent Skills Best Practices][agent-skills-best-practices]
- [Agent Skills Description Optimization][agent-skills-description-optimization]
- [OpenAI Skills][openai-skills]
- [OpenAI Plugins][openai-plugins]
- [OpenAI Admin Controls][openai-admin-controls]
- [OpenAI Package Plugin][openai-package-plugin]
- [OpenAI Plugin Security][openai-plugin-security]
- [OpenAI Skill Creator][openai-skill-creator]
- [OpenAI Evals][openai-evals]
- [Claude Code Skills][claude-code-skills]
- [Claude Code Plugins][claude-code-plugins]
- [Claude Plugin Marketplace][claude-plugin-marketplace]
- [Claude Code Settings][claude-code-settings]
- [Claude Code Security][claude-code-security]
- [Microsoft Agent Skills][ms-agent-skills]
- [Microsoft Agent Evaluation][ms-agent-evaluation]
- [AWS AgentCore Runtime][aws-agentcore-runtime]
- [AWS Runtime API][aws-runtime-api]
- [AWS AgentCore Gateway][aws-agentcore-gateway]
- [AWS AgentCore Identity][aws-agentcore-identity]
- [AWS AgentCore Observability][aws-agentcore-observability]
- [AWS AgentCore Evaluations][aws-agentcore-evaluations]
- [Alibaba Application Publishing][alibaba-application-publishing]
- [Alibaba Plugin Overview][alibaba-plugin-overview]
- [Alibaba Workflow][alibaba-workflow]
- [Alibaba Observation][alibaba-observation]
- [Alibaba Auto Evaluation][alibaba-auto-evaluation]
- [Tencent ADP Evaluation][tencent-adp-evaluation]
- [Tencent AgentOps][tencent-agentops]
- [Tencent ADP Skills][tencent-adp-skills]
- [Volcengine Custom Evaluators][volcengine-custom-evaluators]
- [Volcengine Operations Analysis][volcengine-ops-analysis]
- [xAI Function Calling][xai-function-calling]
- [xAI Structured Outputs][xai-structured-outputs]
- [xAI Changelog][xai-changelog]
- [Apple Tool Call Evaluation][apple-tool-call-evaluation]
- [Apple App Intents][apple-app-intents]
- [Apple Foundation Models][apple-foundation-models]
- [Apple PCC][apple-pcc]

[agent-skills-spec]: https://agentskills.io/specification
[agent-skills-evaluation]: https://agentskills.io/skill-creation/evaluating-skills
[agent-skills-best-practices]: https://agentskills.io/skill-creation/best-practices
[agent-skills-description-optimization]: https://agentskills.io/skill-creation/optimizing-descriptions
[openai-skills]: https://help.openai.com/en/articles/20001066
[openai-plugins]: https://help.openai.com/en/articles/20001256-plugins-in-codex/
[openai-admin-controls]: https://help.openai.com/en/articles/11509118-admin-controls-security-and-compliance-in-connectors-enterprise-edu-and-team
[openai-package-plugin]: https://developers.openai.com/plugins/build/plugins
[openai-plugin-security]: https://developers.openai.com/plugins/guides/security-privacy
[openai-skill-creator]: https://github.com/openai/skills/blob/main/skills/.system/skill-creator/SKILL.md
[openai-evals]: https://developers.openai.com/api/docs/guides/evals
[claude-code-skills]: https://code.claude.com/docs/en/skills
[claude-code-plugins]: https://docs.anthropic.com/en/docs/claude-code/plugins
[claude-plugin-marketplace]: https://docs.anthropic.com/en/docs/claude-code/plugin-marketplace
[claude-code-settings]: https://docs.anthropic.com/en/docs/claude-code/settings
[claude-code-security]: https://docs.anthropic.com/en/docs/claude-code/security
[ms-agent-skills]: https://learn.microsoft.com/en-us/agent-framework/agents/skills
[ms-agent-evaluation]: https://learn.microsoft.com/en-us/agent-framework/agents/evaluation
[aws-agentcore-runtime]: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime.html
[aws-runtime-api]: https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_Operations_Amazon_Bedrock_AgentCore_Control.html
[aws-agentcore-gateway]: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway.html
[aws-agentcore-identity]: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity.html
[aws-agentcore-observability]: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability.html
[aws-agentcore-evaluations]: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/evaluations.html
[alibaba-application-publishing]: https://help.aliyun.com/zh/model-studio/application-call-guide
[alibaba-plugin-overview]: https://help.aliyun.com/zh/model-studio/plugin-overview
[alibaba-workflow]: https://help.aliyun.com/zh/model-studio/workflow-application
[alibaba-observation]: https://help.aliyun.com/zh/model-studio/application-observation
[alibaba-auto-evaluation]: https://help.aliyun.com/zh/model-studio/application-auto-evaluation
[tencent-adp-evaluation]: https://cloud.tencent.com/document/product/1759/104208
[tencent-agentops]: https://adp.tencent.com/zh/blog/adp-version-4-agentops-platform
[tencent-adp-skills]: https://cloud.tencent.com/document/product/1759/129561
[volcengine-custom-evaluators]: https://www.volcengine.com/docs/86681/2220906
[volcengine-ops-analysis]: https://www.volcengine.com/docs/6285/2310370
[xai-function-calling]: https://docs.x.ai/developers/tools/function-calling
[xai-structured-outputs]: https://docs.x.ai/developers/model-capabilities/text/structured-outputs
[xai-changelog]: https://docs.x.ai/docs/changelog
[apple-tool-call-evaluation]: https://developer.apple.com/documentation/Evaluations/evaluating-tool-calling-behavior
[apple-app-intents]: https://developer.apple.com/documentation/appintents
[apple-foundation-models]: https://developer.apple.com/documentation/foundationmodels
[apple-pcc]: https://security.apple.com/blog/private-cloud-compute/
