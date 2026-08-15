# 附录 C：Activation 与 Description 测试夹具

## 本附录证据底座

本附录主要综合 Agent Skills specification、Agent Skills description optimization、Anthropic / Claude Code Skills、OpenAI Skills / tools、Microsoft Agent Framework 和 Cursor Rules 等官方或一手资料，用来把第二章的 activation 原则落成可测试夹具。Agent Skills spec 和 Anthropic 文档都说明，agent 通常先看到 metadata，再决定是否加载 `SKILL.md`；OpenAI tools / skills 和 Cursor Rules 也体现了通过 name / description / rule metadata 路由上下文的设计压力。因此 activation 测试应独立于输出质量测试。[Agent Skills Spec][agent-skills-spec][Agent Skills Description Optimization][agent-skills-description-optimization][Anthropic Agent Skills Overview][anthropic-agent-skills-overview][Claude Code Skills][claude-code-skills][OpenAI Tools and Skills][openai-tools-skills][Cursor Rules][cursor-rules]

本附录的核心结论是：`description` 不是写完就算完成，而是需要像路由规则一样测试。Agent Skills description optimization 建议维护 realistic prompts，并用 `should_trigger: true / false` 覆盖正例和反例；Claude Code 也把 skill not triggering 与 triggers too often 作为两类不同问题处理。[Agent Skills Description Optimization][agent-skills-description-optimization][Claude Code Skills][claude-code-skills]

## C.1 Activation 测试测什么

Activation 测试只回答一个问题：这个 Skill 是否在正确任务中出现，并在不相关任务中保持沉默。它不评价最终产物是否漂亮，也不评价正文是否执行到位；那些属于 body-following 和 output evaluation。[Agent Skills Evaluation][agent-skills-evaluation]

最小测试目标包括：

- 正例：用户没有点名 Skill，但请求与 `description` 高度匹配。
- 显式正例：用户点名 Skill 或使用明确触发词。
- 隐式正例：用户只描述问题，不使用 Skill 名称。
- 近邻反例：任务相似，但应该由另一个 Skill、tool 或普通回答处理。
- 安全反例：如果触发会导致不必要的脚本、工具或外部动作，就必须不触发。

这类测试能提前发现 false positive 和 false negative。false positive 会污染上下文，甚至在带脚本或工具权限的 Skill 中制造安全风险；false negative 则会让真正需要 Skill 的任务回到普通提示词状态。[Agent Skills Description Optimization][agent-skills-description-optimization][Microsoft Agent Safety][ms-agent-safety]

## C.2 推荐夹具结构

推荐把 activation fixtures 放在 `evals/activation.json`：

```json
[
  {
    "id": "positive-explicit-001",
    "query": "Use the cited tutorial writer skill to draft a chapter from these research notes.",
    "should_trigger": true,
    "reason": "The user explicitly asks for the skill and its target task."
  },
  {
    "id": "positive-implicit-001",
    "query": "Please turn these research notes into a tutorial chapter with inline citations and a Sources section.",
    "should_trigger": true,
    "reason": "The request matches the capability even without naming the skill."
  },
  {
    "id": "negative-near-miss-001",
    "query": "Brainstorm possible chapter titles without citations.",
    "should_trigger": false,
    "reason": "The task is quick ideation, not cited tutorial drafting."
  }
]
```

Agent Skills description optimization uses the same basic pattern: each prompt carries the realistic query and expected trigger label. The important part is not the JSON shape itself, but keeping the trigger set separate from output fixtures so description changes can be evaluated without confusing routing quality with writing quality.[Agent Skills Description Optimization][agent-skills-description-optimization]

## C.3 正例怎么写

正例要覆盖不同表达方式，而不是重复同一句话。Agent Skills description optimization 建议正例变化措辞、正式程度、拼写错误和显式程度，避免 description 只适配作者脑中的标准问法。[Agent Skills Description Optimization][agent-skills-description-optimization]

正例至少包括：

- 直接点名 Skill。
- 不点名 Skill，但描述完整任务。
- 只描述痛点，例如“我总是忘记给关键观点加来源”。
- 使用同义词或领域词，例如 citation、references、sources、evidence base。
- 输入不完整但任务方向明确，例如“这些 research notes 能不能变成教程章节”。

不要只写完美请求。真实用户很少用作者设计 description 时的理想句式。

## C.4 反例怎么写

反例比正例更能暴露 description 的边界。一个 description 如果只追求 recall，可能会把所有相似任务都拉进 Skill，导致上下文污染和误执行。[Agent Skills Description Optimization][agent-skills-description-optimization][Anthropic Best Practices][anthropic-best-practices]

反例至少包括：

- 普通聊天：用户只是问概念，不需要产物。
- 快速 brainstorm：用户不要求引用、不要求章节。
- 相邻 Skill：任务应该由 research、code-review、document editing 或其它 Skill 处理。
- 外部事实查询：用户需要最新资料，应先 research 或 browse，而不是直接写。
- 安全边界：用户要求无来源编造引用、绕过审批、执行外部动作。

反例的目的不是阻止 Skill 有用，而是让它只在真正能改善任务质量时出现。

## C.5 Description 修改循环

每次修改 `description` 后，都应重新跑完整 trigger set。Agent Skills description optimization 明确提醒，最后一次描述不一定最好，因为后续版本可能过拟合训练样例；所以 description 迭代应看整体正负样例表现，而不是只修眼前失败。[Agent Skills Description Optimization][agent-skills-description-optimization]

推荐循环：

1. 收集 10 个正例和 10 个反例。
2. 运行 activation fixtures。
3. 记录 false positives 和 false negatives。
4. 只改 `description`，不要改正文来修触发问题。
5. 重跑完整 trigger set。
6. 如果某个真实用户请求失败，把它加入 regression fixtures。

这也符合第二章的原则：routing facts belong in `description`; operating procedure belongs in `SKILL.md`; depth belongs in supporting resources。

## C.6 通过标准

一个 Skill 的 activation 可以进入下一阶段，通常需要满足：

- 所有高优先级正例都触发。
- 所有高风险反例都不触发。
- 近邻反例的误触发已经有明确解释或修复计划。
- `description` 前半段包含最强触发词。
- description 没有变成 catch-all。
- 每次新增真实失败后，fixture 集合会更新。

如果 Skill 会运行 scripts、调用 tools 或触达外部系统，false positive 应按安全问题处理，而不是只按体验问题处理。[Microsoft Agent Safety][ms-agent-safety][OpenAI Plugin Security][openai-plugin-security]

## 本附录小结

附录 C 的核心方法是把 `description` 当作可测试路由合同。一个成熟 Skill 不只要“能用”，还要能被正确叫醒；不只要覆盖正例，还要抵抗近邻误触发。Activation 测试是 Skill 工程化的第一道门。

## Sources

- [Agent Skills Spec][agent-skills-spec]
- [Agent Skills Description Optimization][agent-skills-description-optimization]
- [Agent Skills Evaluation][agent-skills-evaluation]
- [Anthropic Agent Skills Overview][anthropic-agent-skills-overview]
- [Anthropic Best Practices][anthropic-best-practices]
- [Claude Code Skills][claude-code-skills]
- [OpenAI Tools and Skills][openai-tools-skills]
- [OpenAI Plugin Security][openai-plugin-security]
- [Microsoft Adding Skills][ms-adding-skills]
- [Microsoft Agent Safety][ms-agent-safety]
- [Cursor Rules][cursor-rules]

[agent-skills-spec]: https://github.com/agentskills/agentskills/blob/main/docs/specification.mdx
[agent-skills-description-optimization]: https://agentskills.io/skill-creation/optimizing-descriptions
[agent-skills-evaluation]: https://agentskills.io/skill-creation/evaluating-skills
[anthropic-agent-skills-overview]: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
[anthropic-best-practices]: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
[claude-code-skills]: https://code.claude.com/docs/en/skills
[openai-tools-skills]: https://developers.openai.com/api/docs/guides/tools-skills
[openai-plugin-security]: https://developers.openai.com/plugins/guides/security-privacy
[ms-adding-skills]: https://learn.microsoft.com/en-us/agent-framework/journey/adding-skills
[ms-agent-safety]: https://learn.microsoft.com/en-us/agent-framework/agents/safety
[cursor-rules]: https://docs.cursor.com/context/rules-for-ai
