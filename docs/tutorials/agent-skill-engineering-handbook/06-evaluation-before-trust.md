# 第六章 Evaluation Before Trust：先验证，再信任

## 本章证据底座

本章主要综合 Agent Skills evaluation / description optimization / best practices、Claude Code Skills、OpenAI evals / Agents SDK tracing、Microsoft Agent Framework / Foundry / Copilot evaluation、AWS AgentCore Evaluations / Observability、Apple Evaluations、Alibaba Model Studio、Tencent ADP、Volcengine AgentKit 和 xAI tool / structured output 文档，用来说明 Skill 应如何被测试、回归和前向验证。[Agent Skills Evaluation][agent-skills-evaluation][Agent Skills Description Optimization][agent-skills-description-optimization][Agent Skills Best Practices][agent-skills-best-practices][Claude Code Skills][claude-code-skills][OpenAI Evals][openai-evals][OpenAI Agents Tracing][openai-agents-tracing]

本章的核心立场是：Skill 是会改变 agent 行为的组件，不是写完后看一眼最终回答就能信任的提示词。官方资料普遍强调 activation、过程轨迹、工具调用、guardrails、观测数据、人工反馈和版本比较，而不只是最终输出质量。[Microsoft Agent Evaluation][ms-agent-evaluation][Microsoft Foundry Evaluators][ms-foundry-evaluators][AWS AgentCore Evaluations][aws-agentcore-evaluations][Apple Tool Call Evaluation][apple-tool-call-evaluation]

## 6.1 Skill 评估的对象不是“最后一句话”

一个 Skill 至少有五个可评估表面：discovery metadata、loaded body、runtime permissions / tools、process behavior 和 final output。Agent Skills spec 定义了 metadata、`SKILL.md`、resources 和 scripts 的 progressive disclosure；Claude Code 还加入 direct invocation、automatic invocation、allowed tools、visibility、forked context 等产品级行为，这些都可能成为评估对象。[Agent Skills Spec][agent-skills-spec][Claude Code Skills][claude-code-skills]

因此，一个 Skill 看似输出正确，并不代表它真的通过。它可能是误触发了、跳过了验证脚本、读取了错误 reference、调用了禁止工具，或者用高成本路径碰巧生成了可接受文本。[Agent Skills Best Practices][agent-skills-best-practices][Microsoft Foundry Evaluators][ms-foundry-evaluators]

本教程把 skill pass 定义为：

```text
activation_pass
AND body_following_pass
AND trajectory_pass
AND safety_pass
AND output_pass
AND no_unacceptable_cost_or_latency_regression
```

这个定义是本教程对 Agent Skills、OpenAI tracing、Microsoft agent evaluators、AWS trace evaluation 和 Apple tool-call evaluation 的工程化归纳。[Agent Skills Evaluation][agent-skills-evaluation][OpenAI Agents Tracing][openai-agents-tracing][Microsoft Foundry Evaluators][ms-foundry-evaluators][AWS Evaluate API][aws-evaluate-api][Apple Tool Call Evaluation][apple-tool-call-evaluation]

## 6.2 第一层：activation evaluation

Activation evaluation 回答两个问题：该触发时是否触发，不该触发时是否保持安静。Claude Code 文档明确提醒，看到 skill 被触发只证明 Claude 找到了它，不证明 Skill 工作得好；需要分开评估 invocation 和 output。[Claude Code Skills][claude-code-skills]

Agent Skills description optimization 建议维护一组带标签的 realistic prompts，包含 `should_trigger: true` 和 `should_trigger: false`，并建议正负样例覆盖不同措辞、正式程度、拼写错误和显式程度。[Agent Skills Description Optimization][agent-skills-description-optimization]

一个 activation fixture 可以长这样：

```json
[
  { "query": "Draft a cited tutorial chapter from these research notes.", "should_trigger": true },
  { "query": "Give me a quick uncited opinion about skills.", "should_trigger": false }
]
```

Activation testing 不只测明显正例，还要测 near-miss negative。因为 false positive 会把无关 Skill 拉进上下文；如果 Skill 能运行 scripts、调用 tools 或产生副作用，误触发甚至是安全问题。[Agent Skills Description Optimization][agent-skills-description-optimization][Microsoft Agent Safety][ms-agent-safety]

## 6.3 第二层：body-following evaluation

Body-following evaluation 问的是：Skill 被加载后，agent 是否真的遵循 `SKILL.md`。它不看最终答案像不像，而看过程是否符合正文约束。[Agent Skills Best Practices][agent-skills-best-practices]

可以检查这些行为：

- 是否按步骤执行。
- 是否读取了正确 reference。
- 是否没有读取无关 reference。
- 是否运行了规定 script。
- 是否遵守 do-not 条件。
- 是否在输入不足时询问。
- 是否按 completion criteria 验证。
- 是否保留 required terminology 和 output format。

Agent Skills best practices 建议通过真实执行来 refine skills，并阅读 execution traces；它特别指出浪费性步骤、不适用但仍被执行的 instructions、以及选项太多但缺少默认路径等 trace pattern。[Agent Skills Best Practices][agent-skills-best-practices]

因此，正文测试应该包含过程断言，例如：

```text
The run loaded references/citation-style.md only when citation formatting was needed.
The run executed scripts/validate_chapter.py before finalizing.
The run stopped and asked for missing source material instead of inventing citations.
```

这类断言会让 Skill 从“模型大概懂了”变成“行为可以被检查”。[Agent Skills Evaluation][agent-skills-evaluation][Microsoft Agent Evaluation][ms-agent-evaluation]

## 6.4 第三层：trajectory 和 tool-call evaluation

当 Skill 涉及 scripts、tools、MCP、connectors 或 workflows 时，只评估最终产物会漏掉关键风险。OpenAI Agents SDK tracing 会记录 agent run、model turn、function tool call、guardrail、handoff、MCP tool 和 custom span；Microsoft Foundry agent evaluators 也强调要评估 workflow step、tool selection、tool input accuracy、tool output utilization 和 tool call success。[OpenAI Agents Tracing][openai-agents-tracing][Microsoft Foundry Evaluators][ms-foundry-evaluators]

Apple Evaluations 提供 ToolCallEvaluator，用来检查 expected tool calls、argument values、call ordering、additional-call policy、strict all-pass scoring 和 proportional progress；Apple 明确指出，错误工具、错误参数或错误顺序会静默破坏 app。[Apple Tool Call Evaluation][apple-tool-call-evaluation]

AWS AgentCore Evaluations 也以 traces、spans、sessions、tool calls 和 OpenTelemetry / OpenInference instrumentation 为核心，其 Evaluate API 可以包含 expected responses、assertions 和 expected tool trajectories。[AWS AgentCore Evaluations][aws-agentcore-evaluations][AWS Evaluate API][aws-evaluate-api]

所以，如果第五章把能力升级为 tool / MCP / workflow，第六章就必须评估 trajectory：

- 是否调用了正确工具。
- 是否没有调用 forbidden tool。
- 参数是否符合 schema。
- 调用顺序是否正确。
- 是否重复调用了昂贵工具。
- 是否在审批前执行了副作用。
- 是否正确使用工具输出，而不是忽略结果。

## 6.5 第四层：output 和 artifact evaluation

最终输出仍然重要，只是不能单独代表全部质量。OpenAI evals 把 eval 定义为检查模型输出是否满足 style 和 content criteria 的可靠性实践，并支持 data source schema、testing criteria 和 graders；Microsoft Agent Framework 也支持 expected outputs、local evaluators、CI smoke tests 和基于历史响应的评估。[OpenAI Evals][openai-evals][Microsoft Agent Evaluation][ms-agent-evaluation]

Skill output evaluation 应该尽量写成可检查断言：

- 输出是否包含 required sections。
- 是否符合模板。
- 是否引用了所有关键观点。
- 是否没有编造来源。
- 是否生成了预期 artifact。
- 文件是否能打开、渲染或通过 validator。
- 结构化输出是否符合 schema。

xAI structured outputs 和 OpenAI structured outputs / function calling 都体现了同一原则：当输出形状重要时，用 schema 或结构化断言让结果可检查，而不是只靠人工印象。[xAI Structured Outputs][xai-structured-outputs][OpenAI Structured Outputs][openai-structured-outputs]

## 6.6 Fresh-agent forward testing

Skill 作者最容易犯的错误，是在当前对话中测试刚写好的 Skill。当前对话往往已经包含大量背景材料，会掩盖 `SKILL.md` 缺失的信息。Claude Code 和 Agent Skills evaluation guidance 都建议使用 fresh sessions 或 subagents，让每个 eval run 从 clean context 开始。[Claude Code Skills][claude-code-skills][Agent Skills Evaluation][agent-skills-evaluation]

Forward testing 的基本流程是：

1. 把候选 Skill 当作用户会安装的包来测试。
2. 开启 fresh agent context。
3. 只提供 skill path、test prompt、input fixtures 和 output directory。
4. 分别运行 with-skill 和 without-skill，或 new-skill 和 old-skill。
5. 保存 output、trace、timing、token usage、grading 和 human feedback。

这样可以避免“Skill 本身没写清楚，但当前聊天上下文帮它补齐了”的假阳性。[Agent Skills Evaluation][agent-skills-evaluation][Claude Code Skills][claude-code-skills]

## 6.7 fixtures、evals 和 regression

Agent Skills evaluation guidance 建议在 skill directory 内维护 `evals/evals.json`，并为每个 test case 保存 realistic prompt、expected output、input files 和 assertions。它还建议保留 iteration workspace，包括 `with_skill/`、`without_skill/`、outputs、`timing.json`、`grading.json` 和 aggregate benchmark。[Agent Skills Evaluation][agent-skills-evaluation]

本教程建议一个 pro-level Skill 至少准备这些 eval 文件：

```text
evals/
  activation.json
  behavior.json
  trajectory.json
  safety.json
  regression.json
  reports/
```

其中：

- `activation.json` 测 should-trigger / should-not-trigger。
- `behavior.json` 测正文跟随和输出断言。
- `trajectory.json` 测工具、脚本、MCP、workflow 调用轨迹。
- `safety.json` 测越权、注入、敏感数据、副作用和审批。
- `regression.json` 保存真实失败转化来的回归样例。

每次真实失败都应该被分类：missed activation、bad trigger、wrong tool、unsafe action、skipped validation、brittle output format、trace inefficiency、human-review complaint。能复现的失败应该进入 regression fixtures，而不是只在 changelog 里写“已修复”。[Agent Skills Evaluation][agent-skills-evaluation][OpenAI Evals][openai-evals][Microsoft Agent Evaluation][ms-agent-evaluation]

## 6.8 安全测试和 guardrails

带 tool access、scripts 或 side effects 的 Skill 必须当作安全边界来测。Claude Code 支持 `disable-model-invocation`、permission rules、visibility overrides 和 `allowed-tools`；OpenAI Agents SDK 把 guardrails 作为 first-class primitive，并默认记录 guardrail spans；Microsoft、AWS、Alibaba、Tencent、Volcengine 都提供安全评估、guardrail 或 AgentOps 相关能力。[Claude Code Skills][claude-code-skills][OpenAI Agents SDK][openai-agents-sdk][OpenAI Agents Tracing][openai-agents-tracing][Microsoft Agent Evaluation][ms-agent-evaluation][AWS AgentCore Evaluations][aws-agentcore-evaluations]

Safety fixtures 应覆盖：

- prompt injection against skill instructions。
- unsafe direct invocation attempts。
- network / file / shell / deployment / messaging / payment / deletion overreach。
- secret exposure 或 credential exfiltration。
- dependency / script abuse。
- missing approval before side effects。
- hidden / disabled skill bypass。
- 输出政策违规。

Microsoft safety guidance 强调修改数据、发送通信、购买、访问敏感数据、不可逆操作和广泛影响通常需要 approval；Tencent ADP 4.0 也描述了 Skills code scanning、外网访问检查、dependency allowlist、多级审批和全链路 observability 等治理能力。[Microsoft Agent Safety][ms-agent-safety][Tencent AgentOps][tencent-agentops]

## 6.9 observability：把线上失败带回 eval

Observability 是 eval fixtures 和真实使用之间的桥。OpenAI Agents SDK tracing 支持 workflow names、group IDs、metadata、custom processors、sensitive-data controls 和 trace export；AWS AgentCore Observability 提供 session count、latency、duration、token usage、errors、OpenTelemetry-compatible telemetry、trace visualizations、logs 和 span data。[OpenAI Agents Tracing][openai-agents-tracing][AWS AgentCore Observability][aws-agentcore-observability]

Alibaba application observation 可以查看端到端 processing flow、prompts、outputs、latency、token usage、tool nodes 和 guardrail nodes，并能把 Span data 加入 evaluation sets；Tencent ADP 4.0 描述了 call volume、error rate、cost、call-chain tracing、log audit、run playback、tool usage、resource consumption 和 safety-policy triggers。[Alibaba Observation][alibaba-observation][Tencent AgentOps][tencent-agentops]

Skill observability 至少应该记录：

- `skill_name` 和 `skill_version`。
- activation mode。
- loaded references / assets。
- scripts / tools / MCP calls。
- arguments、outputs、errors、retries。
- validation status。
- approvals 和 guardrail events。
- token count、duration、latency、cost。
- final artifact hash。
- human feedback status。

这些数据能帮助维护者把真实失败转化为 regression fixtures，而不是靠记忆维护 Skill。[AWS AgentCore Observability][aws-agentcore-observability][Alibaba Observation][alibaba-observation]

## 6.10 版本比较和 blind review

Skill 修改可能让最终输出看起来差不多，却改变 activation、工具轨迹、成本或安全边界。Agent Skills evaluation guidance 建议进行 with-skill / without-skill、new / old version 对比，并保存 benchmark；Tencent ADP 支持不同模型和 prompt configurations 的 comparison evaluation；Volcengine operations analysis 也描述了不同 agent、prompt、model 或参数版本的实验支持。[Agent Skills Evaluation][agent-skills-evaluation][Tencent ADP Evaluation][tencent-adp-evaluation][Volcengine Operations Analysis][volcengine-ops-analysis]

版本比较应报告：

- activation precision / recall delta。
- assertion pass-rate delta。
- trajectory correctness delta。
- safety pass / fail。
- human preference。
- token 和 duration delta。
- error / retry delta。
- trace efficiency notes。

如果输出质量需要主观判断，可以使用 blind A/B review。这样评审者不先知道哪个是新版本，能减少“新的一定更好”的偏见。[Agent Skills Evaluation][agent-skills-evaluation]

## 6.11 human feedback loop

自动断言只能捕捉你预料到的问题。Agent Skills evaluation guidance 建议人工查看真实 outputs 和 grades，把具体反馈保存到 `feedback.json`；迭代时同时使用 failed assertions、human feedback 和 execution transcripts。[Agent Skills Evaluation][agent-skills-evaluation]

Volcengine AgentKit evaluator docs 也提醒 LLM evaluator 的分数和理由可能存在偏差，并支持 human calibration 和修改 evaluator scores；Alibaba Model Studio 支持业务专家基于维度和数据集进行 manual evaluation。[Volcengine Custom Evaluators][volcengine-custom-evaluators][Alibaba Model Evaluation][alibaba-model-evaluation]

本教程建议的反馈循环是：

1. 跑 activation、behavior、trajectory、safety 和 output eval。
2. 人工审查 artifact 和 transcript。
3. 按 test case 记录 feedback。
4. 把重复反馈转成 assertion、validator、example 或 gotcha。
5. 重跑完整 regression suite。
6. 对 taste、clarity、usefulness、domain judgment 保留人工评审。

## 6.12 本章检查清单

发布或升级 Skill 前，检查这些问题：

- 是否有正负 activation fixtures。
- 是否测试 false positives 和 false negatives。
- 是否用 fresh-agent context 测试。
- 是否有 with-skill / without-skill 或 old / new baseline。
- 是否检查正文跟随，而不是只看最终输出。
- 是否检查 reference、asset、script 的使用路径。
- 是否检查 expected / forbidden tool calls。
- 是否覆盖 prompt injection、权限越界、敏感数据和副作用。
- 是否记录 token、duration、latency、error 和 retry。
- 是否把真实失败加入 regression。
- 是否保留人工反馈。

这份检查清单是本教程对 Agent Skills、OpenAI、Microsoft、AWS、Apple、Alibaba、Tencent、Volcengine 等资料的评估实践归纳，用来避免 final-output-only evaluation。[Agent Skills Evaluation][agent-skills-evaluation][OpenAI Agents Tracing][openai-agents-tracing][Microsoft Foundry Evaluators][ms-foundry-evaluators][AWS AgentCore Evaluations][aws-agentcore-evaluations][Apple Tool Call Evaluation][apple-tool-call-evaluation]

## 本章小结

第六章的核心结论是：Skill 必须先验证，再信任。一个成熟 Skill 不是“能生成好看的答案”，而是能在正确任务中触发、按正文执行、正确使用资源和工具、守住安全边界、生成合格产物，并且在版本变化后仍可被回归测试。[Agent Skills Evaluation][agent-skills-evaluation][Agent Skills Best Practices][agent-skills-best-practices][Microsoft Agent Evaluation][ms-agent-evaluation]

下一章将讨论 security and governance：当 Skill 能影响 agent 行为、运行 scripts、调用 tools 或进入组织分发时，应该如何做信任评审、权限控制、审批、审计和发布治理。

## Sources

- [Agent Skills Spec][agent-skills-spec]
- [Agent Skills Evaluation][agent-skills-evaluation]
- [Agent Skills Description Optimization][agent-skills-description-optimization]
- [Agent Skills Best Practices][agent-skills-best-practices]
- [Agent Skills Using Scripts][agent-skills-using-scripts]
- [Claude Code Skills][claude-code-skills]
- [OpenAI Skills][openai-skills]
- [OpenAI Evals][openai-evals]
- [OpenAI Agents SDK][openai-agents-sdk]
- [OpenAI Agents Tracing][openai-agents-tracing]
- [OpenAI Structured Outputs][openai-structured-outputs]
- [Microsoft Agent Evaluation][ms-agent-evaluation]
- [Microsoft Foundry Evaluators][ms-foundry-evaluators]
- [Microsoft Agent Safety][ms-agent-safety]
- [AWS AgentCore Evaluations][aws-agentcore-evaluations]
- [AWS Evaluate API][aws-evaluate-api]
- [AWS AgentCore Observability][aws-agentcore-observability]
- [Apple Tool Call Evaluation][apple-tool-call-evaluation]
- [Alibaba Observation][alibaba-observation]
- [Alibaba Model Evaluation][alibaba-model-evaluation]
- [Tencent ADP Evaluation][tencent-adp-evaluation]
- [Tencent AgentOps][tencent-agentops]
- [Volcengine Custom Evaluators][volcengine-custom-evaluators]
- [Volcengine Operations Analysis][volcengine-ops-analysis]
- [xAI Structured Outputs][xai-structured-outputs]

[agent-skills-spec]: https://agentskills.io/specification
[agent-skills-evaluation]: https://agentskills.io/skill-creation/evaluating-skills
[agent-skills-description-optimization]: https://agentskills.io/skill-creation/optimizing-descriptions
[agent-skills-best-practices]: https://agentskills.io/skill-creation/best-practices
[agent-skills-using-scripts]: https://agentskills.io/skill-creation/using-scripts
[claude-code-skills]: https://code.claude.com/docs/en/skills
[openai-skills]: https://help.openai.com/en/articles/20001066
[openai-evals]: https://developers.openai.com/api/docs/guides/evals
[openai-agents-sdk]: https://openai.github.io/openai-agents-python/
[openai-agents-tracing]: https://openai.github.io/openai-agents-python/tracing/
[openai-structured-outputs]: https://developers.openai.com/api/docs/guides/structured-outputs
[ms-agent-evaluation]: https://learn.microsoft.com/en-us/agent-framework/agents/evaluation
[ms-foundry-evaluators]: https://learn.microsoft.com/en-us/azure/foundry/concepts/evaluation-evaluators/agent-evaluators?preserve-view=true&view=foundry
[ms-agent-safety]: https://learn.microsoft.com/en-us/agent-framework/agents/safety
[aws-agentcore-evaluations]: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/evaluations.html
[aws-evaluate-api]: https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_Evaluate.html
[aws-agentcore-observability]: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability.html
[apple-tool-call-evaluation]: https://developer.apple.com/documentation/Evaluations/evaluating-tool-calling-behavior
[alibaba-observation]: https://help.aliyun.com/zh/model-studio/application-observation
[alibaba-model-evaluation]: https://help.aliyun.com/zh/model-studio/model-evaluation-overview
[tencent-adp-evaluation]: https://cloud.tencent.com/document/product/1759/104208
[tencent-agentops]: https://adp.tencent.com/zh/blog/adp-version-4-agentops-platform
[volcengine-custom-evaluators]: https://www.volcengine.com/docs/86681/2220906
[volcengine-ops-analysis]: https://www.volcengine.com/docs/6285/2310370
[xai-structured-outputs]: https://docs.x.ai/developers/model-capabilities/text/structured-outputs
