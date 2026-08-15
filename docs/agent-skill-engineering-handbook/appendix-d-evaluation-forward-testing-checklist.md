# 附录 D：Evaluation 与 Forward Testing Checklist

## 本附录证据底座

本附录主要综合 Agent Skills evaluation / best practices、Claude Code Skills、OpenAI evals / Agents SDK tracing、Microsoft Agent Framework evaluation、AWS AgentCore Evaluations / Observability、Apple Evaluations 等官方或一手资料，用来把第六章的评估方法压缩成可执行检查清单。[Agent Skills Evaluation][agent-skills-evaluation][Agent Skills Best Practices][agent-skills-best-practices][Claude Code Skills][claude-code-skills][OpenAI Evals][openai-evals][OpenAI Agents Tracing][openai-agents-tracing]

本附录的核心结论是：Skill 评估不应只看最终回答。Agent Skills best practices 建议阅读 execution traces；AWS、Microsoft、OpenAI 和 Apple 的评估资料也都把 trace、tool calls、spans、expected outputs、guardrails 或 tool-call trajectory 纳入评估对象。[Agent Skills Best Practices][agent-skills-best-practices][AWS AgentCore Evaluations][aws-agentcore-evaluations][Microsoft Agent Evaluation][ms-agent-evaluation][Apple Tool Call Evaluation][apple-tool-call-evaluation]

## D.1 最小评估面

一个可复用 Skill 至少要覆盖五个评估面：

- Activation：是否正确触发。
- Body following：触发后是否按正文执行。
- Resource use：是否读取正确 references、使用正确 assets、运行必要 scripts。
- Output quality：最终产物是否满足结构、格式、引用、质量标准。
- Safety：是否避免越权、误用工具、执行危险动作或泄漏数据。

如果 Skill 使用 tools、MCP、connectors 或 workflows，还要增加 trajectory evaluation：工具是否正确、参数是否正确、调用顺序是否正确、是否出现多余或危险调用。[Apple Tool Call Evaluation][apple-tool-call-evaluation][AWS AgentCore Evaluations][aws-agentcore-evaluations]

## D.2 推荐评估目录

推荐在 L3 Skill 或团队共享 Skill 中使用：

```text
skill-name/
  SKILL.md
  evals/
    activation.json
    body-following.json
    output.json
    trajectory.json
    safety.json
    regression.json
    runs/
      2026-08-15/
        outputs/
        traces/
        feedback.json
```

`evals/` 不是 portable Skill 的必需目录，而是本教程建议的工程化增强。它的作用是让 Skill 的行为变化可回放、可比较、可回归，而不是只依赖作者记忆。[Agent Skills Evaluation][agent-skills-evaluation][OpenAI Evals][openai-evals]

## D.3 Fresh-Agent Forward Testing

Forward testing 应尽量使用 fresh agent context。Claude Code / Agent Skills evaluation guidance 都强调，不要让测试 agent 看到作者的隐藏上下文，否则 Skill 的缺口会被当前对话补齐，测试结果会虚高。[Claude Code Skills][claude-code-skills][Agent Skills Evaluation][agent-skills-evaluation]

推荐流程：

1. 准备测试 prompt、输入文件和输出目录。
2. 启动 fresh agent。
3. 只提供 skill path、测试请求和必要输入。
4. 不提供作者预期答案、诊断结论或修复方向。
5. 保存输出、trace、时间、token、错误和人工反馈。
6. 对失败案例分类并写入 regression fixtures。

如果一个 Skill 只有在测试 agent 知道作者意图时才通过，那不是测试通过，而是 Skill 本身还没写清楚。

## D.4 Body-Following Checklist

检查正文是否被执行，不要只看最终输出。Agent Skills best practices 建议从 trace 中找 wasted steps、无关指令被执行、选项太多但缺少默认路径等问题。[Agent Skills Best Practices][agent-skills-best-practices]

Body-following 检查：

- 是否读取了 `SKILL.md`。
- 是否遵守 `Operational Boundaries`。
- 是否识别了必需输入。
- 是否在关键输入缺失时询问，而不是硬做。
- 是否按 workflow 顺序完成关键步骤。
- 是否按需读取 references。
- 是否使用 assets 生成产物，而不是重造模板。
- 是否运行必要 scripts。
- 是否执行最终 validation。
- 是否在总结中说明验证结果或剩余风险。

这一层的失败通常说明正文太散、步骤没有 completion criteria、资源路由不够清楚，或者 quality bar 太抽象。

## D.5 Output Checklist

Output evaluation 检查最终产物是否满足规格。OpenAI evals 支持用 criteria 和 graders 检查 style / content；Microsoft evaluation 也支持 expected outputs、local evaluators 和 CI smoke tests。[OpenAI Evals][openai-evals][Microsoft Agent Evaluation][ms-agent-evaluation]

输出检查：

- 结构是否符合 Skill 要求。
- 必填部分是否齐全。
- 引用、链接、表格、代码块等格式是否完整。
- 是否遵守用户语言、语气、长度和交付形态。
- 是否有 unsupported claims。
- 是否有 hallucinated sources。
- 是否有未说明的假设。
- 是否没有把 research synthesis 伪装成 vendor standard。

对于写作型 Skill，output eval 应同时包含机器可检查项和人工审阅项。纯自动评分只能覆盖作者预想到的断言，不能替代人工判断。[Agent Skills Evaluation][agent-skills-evaluation]

## D.6 Trajectory Checklist

当 Skill 会调用工具、脚本、MCP 或 connector 时，评估必须进入过程轨迹。Apple ToolCallEvaluator 检查 expected tool calls、参数值、调用顺序和额外调用策略；AWS AgentCore Evaluations 可以基于 traces、spans、tool calls 和 expected tool trajectories 评估 agent 行为。[Apple Tool Call Evaluation][apple-tool-call-evaluation][AWS AgentCore Evaluations][aws-agentcore-evaluations]

Trajectory 检查：

- 是否调用了正确工具。
- 是否没有调用禁止工具。
- 参数是否符合 schema。
- 调用顺序是否正确。
- 是否重复调用无必要工具。
- 是否在外部动作前请求审批。
- 是否记录 trace、span、tool result 和错误。
- 是否在工具失败后按 Skill 中的恢复策略处理。

如果 trajectory 错了，即使最后文本看起来合理，也不能算 Skill 通过。

## D.7 Regression Loop

真实失败应该变成 regression fixtures，而不是只写在聊天记录或 changelog 中。Agent Skills evaluation guidance 建议把 failed assertions、human feedback 和 execution transcripts 共同用于迭代；AWS、OpenAI、Microsoft 等平台也都强调评估与观测数据的反馈循环。[Agent Skills Evaluation][agent-skills-evaluation][AWS AgentCore Observability][aws-agentcore-observability][OpenAI Agents Tracing][openai-agents-tracing]

每个真实失败至少记录：

- 失败类型：activation、body-following、resource、script、tool、output、safety。
- 原始用户请求。
- 当时 Skill 版本。
- 失败输出或 trace。
- 修复方式。
- 新增 fixture。
- 复测结果。

没有进入 regression 的修复，很容易在下一次 description、正文、模型或工具变化时重新出现。

## D.8 发布前通过标准

一个团队共享 Skill 进入使用前，建议满足：

- Activation 正反例通过。
- Body-following 核心路径通过。
- Output fixtures 通过。
- Safety fixtures 通过。
- Tool / trajectory fixtures 通过，若适用。
- Fresh-agent forward tests 通过。
- 至少一次 with-skill / without-skill 或 old / new 比较。
- 人工审阅没有阻塞问题。
- 新增失败已进入 regression fixtures。

这不是为了追求仪式感，而是为了证明 Skill 的行为可以被重复观察和维护。

## 本附录小结

附录 D 的核心结论是：Skill 只有经过 fresh-agent、fixture、trace、output、safety 和 regression 检查后，才值得被长期信任。最终答案只是结果之一；真正的评估对象是 agent 从触发到交付的完整行为。

## Sources

- [Agent Skills Evaluation][agent-skills-evaluation]
- [Agent Skills Best Practices][agent-skills-best-practices]
- [Claude Code Skills][claude-code-skills]
- [OpenAI Evals][openai-evals]
- [OpenAI Agents Tracing][openai-agents-tracing]
- [Microsoft Agent Evaluation][ms-agent-evaluation]
- [AWS AgentCore Evaluations][aws-agentcore-evaluations]
- [AWS AgentCore Observability][aws-agentcore-observability]
- [Apple Tool Call Evaluation][apple-tool-call-evaluation]

[agent-skills-evaluation]: https://agentskills.io/skill-creation/evaluating-skills
[agent-skills-best-practices]: https://agentskills.io/skill-creation/best-practices
[claude-code-skills]: https://code.claude.com/docs/en/skills
[openai-evals]: https://developers.openai.com/api/docs/guides/evals
[openai-agents-tracing]: https://openai.github.io/openai-agents-python/tracing/
[ms-agent-evaluation]: https://learn.microsoft.com/en-us/agent-framework/agents/evaluation
[aws-agentcore-evaluations]: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/evaluations.html
[aws-agentcore-observability]: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability.html
[apple-tool-call-evaluation]: https://developer.apple.com/documentation/Evaluations/evaluating-tool-calling-behavior

