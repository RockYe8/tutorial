# 附录 E：Security / Release Checklist

## 本附录证据底座

本附录主要综合 OpenAI Skills / Plugins / plugin security、Claude Code Skills / Plugins / Security / Settings、Agent Skills spec、Microsoft Agent Framework safety / skills、AWS AgentCore Gateway / Policy / Observability、Tencent ADP、Alibaba Model Studio、xAI connectors 和 Apple Private Cloud Compute 等官方或一手资料，用来把第七章和第八章的安全治理原则压缩为发布前检查清单。[OpenAI Skills][openai-skills][OpenAI Plugins][openai-plugins][OpenAI Plugin Security][openai-plugin-security][Claude Code Security][claude-code-security][Claude Code Settings][claude-code-settings][Microsoft Agent Safety][ms-agent-safety][AWS AgentCore Gateway][aws-agentcore-gateway][Apple PCC][apple-pcc]

本附录的核心结论是：进入团队或企业分发后，Skill / plugin / connector / MCP / workflow bundle 应像 dependency package 一样治理，而不是像普通提示词一样信任。OpenAI、Claude Code、Microsoft 和 AWS 等资料都强调权限、审批、沙箱、OAuth、审计、观测、版本和 admin-managed distribution 的重要性。[OpenAI Admin Controls][openai-admin-controls][Claude Code Plugins][claude-code-plugins][Microsoft Agent Skills][ms-agent-skills][AWS AgentCore Policy][aws-agentcore-policy]

## E.1 Package Review

先审包，再审话术。一个能力包可能包含 `SKILL.md`、references、assets、scripts、hooks、MCP config、app mappings、settings、marketplace metadata 和 install logic；这些内容都可能改变 agent 行为或执行环境。[Agent Skills Spec][agent-skills-spec][OpenAI Package Plugin][openai-package-plugin][Claude Code Plugins][claude-code-plugins]

发布前检查：

- 包里包含哪些文件和目录？
- 是否有 executable scripts、hooks、install scripts 或 binary？
- 是否有 MCP server 配置？
- 是否有 connector、app mapping 或 external API 依赖？
- 是否有 settings、permission rules 或 allowed tools？
- 是否有第三方依赖、远程下载或 marketplace dependency？
- 是否有不必要的 README、安装说明、历史材料或过期示例混入 bare Skill？

bare Skill 应保持 lean；bundle 可以包含发布和生命周期材料，但必须把 package boundary 写清楚。

## E.2 Invocation Controls

自动触发本身就是风险面。Claude Code 区分 model-invoked 和 user-invoked，并支持 `disable-model-invocation`；从 progressive disclosure 角度看，`description` 是长期暴露给模型的路由入口，会带来 context load 和自动触发风险。[Claude Code Skills][claude-code-skills][Agent Skills Spec][agent-skills-spec]

发布前检查：

- 这个 Skill 是否需要自动触发？
- 如果只应手动调用，是否禁用了 model invocation？
- `description` 是否过宽，像 catch-all？
- 是否存在与其它 Skill 的触发冲突？
- 是否有 false positive fixtures？
- 是否因为 tool 或 script 权限导致误触发风险升高？

如果 Skill 可能执行外部动作，误触发就不是小问题，而是安全问题。[Microsoft Agent Safety][ms-agent-safety]

## E.3 Tool 与 Side Effect Controls

Skill 可以教 agent 怎么做，但不应该私自携带权力。工具调用、外部系统动作、写操作、删除、发布、支付、发送、权限变更等副作用应由 tool、connector、workflow、gateway 或平台审批机制承载。[Microsoft Agent Safety][ms-agent-safety][AWS AgentCore Gateway][aws-agentcore-gateway][OpenAI Plugin Security][openai-plugin-security]

发布前检查：

- 哪些工具允许被调用？
- 哪些工具明确禁止？
- 写操作是否需要 human approval？
- 工具参数是否有 schema 和 server-side validation？
- 是否记录 tool call、参数摘要、审批结果和错误？
- 是否有 retry、rollback 或 compensation plan？
- 是否把确定性但本地低风险步骤留在 scripts，把外部副作用升级到 tool/workflow？

危险动作不应只靠一句“谨慎操作”来控制。

## E.4 Identity、Secrets 与 OAuth

Credentials 不属于 Skill 文件。OpenAI plugin security guidance 建议使用 OAuth、scopes、token validation 和 least privilege；xAI connectors、AWS AgentCore 和 Alibaba / Tencent 平台资料也都把外部系统访问放在 connector、identity、permission 或 admin-managed boundary 中。[OpenAI Plugin Security][openai-plugin-security][xAI Connectors][xai-connectors][AWS AgentCore Gateway][aws-agentcore-gateway]

发布前检查：

- 是否有 API key、token、cookie、password、private key 被写进 Skill、reference、asset 或 script？
- 外部访问是否走 OAuth、workload identity、connector identity 或 secret manager？
- scopes 是否最小化？
- source-system ACL 是否仍然生效？
- token 过期、撤销、畸形时是否返回明确错误？
- 日志是否避免泄漏 secrets、PII 和完整 prompt？

任何硬编码 credential 都应阻塞发布。

## E.5 Script Sandbox 与 Supply Chain

Scripts 是代码，不是说明文字。Microsoft Agent Skills security guidance 建议像第三方代码一样审查 skills，并对 scripts 使用 sandbox、resource limits、input validation、allow-lists 和 logging；Claude Code 也强调插件、hooks、MCP server 和 command-sourced packages 的信任边界。[Microsoft Agent Skills][ms-agent-skills][Claude Code Security][claude-code-security]

发布前检查：

- scripts 是否最小化、可读、可测试？
- 是否限制 CPU、memory、wall-clock time？
- 是否限制可执行命令和文件访问范围？
- 是否验证输入路径和用户内容？
- 是否避免任意 shell 拼接？
- 依赖是否锁版本？
- 是否有 dependency review 和安全扫描？
- 是否有脚本失败时的清晰错误和恢复路径？

如果脚本需要网络、凭证或外部写操作，应重新评估它是否应该升级为 tool、connector 或 workflow。

## E.6 Distribution 与 Admin Controls

企业级分发不应依赖聊天复制、个人路径或临时压缩包。OpenAI admin controls、Claude Code plugin marketplace、Tencent ADP enterprise-shared skills 和 AWS AgentCore Registry / Gateway 都说明，组织级能力应该通过 admin-managed catalog、marketplace、registry、approval 或 permission policy 管理。[OpenAI Admin Controls][openai-admin-controls][Claude Plugin Marketplaces][claude-plugin-marketplaces][Tencent ADP Skills][tencent-adp-skills][AWS AgentCore Registry][aws-agentcore-registry]

发布前检查：

- 分发范围是 personal、project、workspace、enterprise 还是 public marketplace？
- 是否有 owner 和 backup owner？
- 是否有版本号和 release notes？
- 是否通过 trusted source 安装？
- 是否禁止任意 public marketplace 或 command-sourced plugin？
- enterprise scope 是否有 admin approval？
- 是否能快速 disable package、connector 或 write action？

分发范围越大，review gate 越重。

## E.7 Observability 与 Audit

没有审计日志，就没有可靠治理。OpenAI plugin security guidance 建议 audit logs、correlation IDs、PII redaction、异常监控和错误告警；AWS AgentCore Observability 提供 traces、spans、metrics、logs；Tencent ADP 和 Alibaba Model Studio 也提供观察、评估或链路分析能力。[OpenAI Plugin Security][openai-plugin-security][AWS AgentCore Observability][aws-agentcore-observability][Tencent ADP Evaluation][tencent-adp-evaluation][Alibaba Observation][alibaba-observation]

发布前检查：

- 是否记录 skill load？
- 是否记录 reference read？
- 是否记录 script execution？
- 是否记录 tool / connector call？
- 是否记录 approval prompt 和 approval result？
- 是否记录 policy decision 和 identity？
- 是否能按 version、user、workspace、trace id 定位问题？
- 是否避免记录 secrets、PII 和不必要的 raw prompt？

Observability 不只是排障功能，也是安全控制。

## E.8 Rollback 与 Emergency Disable

共享 Skill 必须有 rollback 和 emergency disable。第八章已经说明，Skill 是行为依赖；模型、工具、API、connector 权限、MCP server 或 runtime 改变，都可能破坏行为，即使 `SKILL.md` 没改。[Agent Skills Evaluation][agent-skills-evaluation][OpenAI Evals][openai-evals][Microsoft Agent Evaluation][ms-agent-evaluation]

发布前检查：

- 最新 known-good version 是什么？
- 如何回滚 Skill 文件？
- 如何回滚 plugin / marketplace version？
- 如何禁用 model invocation？
- 如何撤销 connector、OAuth scopes 或 write permissions？
- 如何禁用 MCP server 或 gateway target？
- 回滚后要跑哪些 regression tests？
- 谁有权限执行 emergency disable？

未经测试的回滚路径，只是乐观备注。

## E.9 Release Gate

团队或企业发布前，建议所有 gate 通过：

- Package review completed。
- Activation fixtures passed。
- Body-following fixtures passed。
- Output fixtures passed。
- Safety fixtures passed。
- Script review passed，若适用。
- Tool / connector / MCP permission review passed，若适用。
- Admin approval recorded，若适用。
- Observability and audit logging enabled。
- Rollback and emergency disable tested。
- Owner、version、distribution scope、review date 已记录。

如果任一项阻塞，就不要把 Skill 推到更大范围。发布不是把文件复制出去，而是把一个会影响 agent 行为的依赖引入环境。

## 本附录小结

附录 E 的核心结论是：安全发布不是给 Skill 增加几句警告，而是把 capability、authority、identity、execution、distribution、observability 和 rollback 分开治理。Skill teaches；platform authorizes；tool executes；workflow governs；audit records。

## Sources

- [Agent Skills Spec][agent-skills-spec]
- [Agent Skills Evaluation][agent-skills-evaluation]
- [OpenAI Skills][openai-skills]
- [OpenAI Plugins][openai-plugins]
- [OpenAI Package Plugin][openai-package-plugin]
- [OpenAI Admin Controls][openai-admin-controls]
- [OpenAI Plugin Security][openai-plugin-security]
- [OpenAI Evals][openai-evals]
- [Claude Code Skills][claude-code-skills]
- [Claude Code Plugins][claude-code-plugins]
- [Claude Code Security][claude-code-security]
- [Claude Code Settings][claude-code-settings]
- [Claude Plugin Marketplaces][claude-plugin-marketplaces]
- [Microsoft Agent Skills][ms-agent-skills]
- [Microsoft Agent Safety][ms-agent-safety]
- [Microsoft Agent Evaluation][ms-agent-evaluation]
- [AWS AgentCore Gateway][aws-agentcore-gateway]
- [AWS AgentCore Policy][aws-agentcore-policy]
- [AWS AgentCore Registry][aws-agentcore-registry]
- [AWS AgentCore Observability][aws-agentcore-observability]
- [xAI Connectors][xai-connectors]
- [Tencent ADP Skills][tencent-adp-skills]
- [Tencent ADP Evaluation][tencent-adp-evaluation]
- [Alibaba Observation][alibaba-observation]
- [Apple PCC][apple-pcc]

[agent-skills-spec]: https://github.com/agentskills/agentskills/blob/main/docs/specification.mdx
[agent-skills-evaluation]: https://agentskills.io/skill-creation/evaluating-skills
[openai-skills]: https://help.openai.com/en/articles/20001066
[openai-plugins]: https://help.openai.com/en/articles/20001256-plugins-in-codex/
[openai-package-plugin]: https://developers.openai.com/plugins/build/plugins
[openai-admin-controls]: https://help.openai.com/en/articles/11509118-admin-controls-security-and-compliance-in-connectors-enterprise-edu-and-team
[openai-plugin-security]: https://developers.openai.com/plugins/guides/security-privacy
[openai-evals]: https://developers.openai.com/api/docs/guides/evals
[claude-code-skills]: https://code.claude.com/docs/en/skills
[claude-code-plugins]: https://code.claude.com/docs/en/plugins
[claude-code-security]: https://docs.anthropic.com/en/docs/claude-code/security
[claude-code-settings]: https://docs.anthropic.com/en/docs/claude-code/settings
[claude-plugin-marketplaces]: https://code.claude.com/docs/en/plugin-marketplaces
[ms-agent-skills]: https://learn.microsoft.com/en-us/agent-framework/agents/skills
[ms-agent-safety]: https://learn.microsoft.com/en-us/agent-framework/agents/safety
[ms-agent-evaluation]: https://learn.microsoft.com/en-us/agent-framework/agents/evaluation
[aws-agentcore-gateway]: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway.html
[aws-agentcore-policy]: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy.html
[aws-agentcore-registry]: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-concepts.html
[aws-agentcore-observability]: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability.html
[xai-connectors]: https://docs.x.ai/grok/connectors
[tencent-adp-skills]: https://cloud.tencent.com/document/product/1759/129561
[tencent-adp-evaluation]: https://cloud.tencent.com/document/product/1759/104208
[alibaba-observation]: https://help.aliyun.com/zh/model-studio/application-observation
[apple-pcc]: https://security.apple.com/blog/private-cloud-compute/
