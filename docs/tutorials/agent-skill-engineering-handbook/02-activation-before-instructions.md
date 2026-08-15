# 第二章 Activation Before Instructions：先设计触发，再设计内容

## 本章证据底座

本章主要综合 Agent Skills open specification、Anthropic Agent Skills、Claude Code Skills、OpenAI Skills / API tools and skills、OpenAI Plugins、Microsoft Agent Framework 和 Cursor Rules 等官方或一手资料，用来说明一个核心事实：Skill 的第一接口不是正文，而是 metadata，尤其是 `name` 和 `description`。[Agent Skills Spec][agent-skills-spec][Anthropic Agent Skills Overview][anthropic-agent-skills-overview][Anthropic Best Practices][anthropic-best-practices][Claude Code Skills][claude-code-skills][OpenAI Skills][openai-skills][OpenAI Tools and Skills][openai-tools-skills][Microsoft Adding Skills][ms-adding-skills]

本章也会引用 Cursor Rules 作为邻近证据：它不是 Agent Skill 标准，但它展示了同一类设计压力，即不要把所有规则永远塞进上下文，而是用描述、路径或人工触发来决定什么时候附加专门规则。[Cursor Rules][cursor-rules]

## 2.1 为什么先设计 activation

第一章已经说明，Skill 不是一段普通提示词，而是 agent 可以发现、加载、执行和扩展的能力包。第二章要进一步强调：在 agent 真正读取 `SKILL.md` 正文之前，它通常先看到的是 Skill 的 metadata，尤其是 `name` 和 `description`。[Agent Skills Spec][agent-skills-spec][Anthropic Agent Skills Overview][anthropic-agent-skills-overview][OpenAI Tools and Skills][openai-tools-skills]

Agent Skills spec 把这种机制称为 progressive disclosure：metadata 在启动时加载，`SKILL.md` 在 skill 被激活时加载，额外资源则只在需要时读取。[Agent Skills Spec][agent-skills-spec]

Anthropic 的 Agent Skills 文档采用同样模型：Claude 先加载 skill metadata，把用户请求与 description 匹配，只有相关 skill 的 `SKILL.md` 会被读取，引用文件则继续按需加载。[Anthropic Agent Skills Overview][anthropic-agent-skills-overview]

OpenAI 的 Skills / tools 文档也描述了类似模式：当 skills 可用时，模型先获得 skill 的 name、description 和 path；如果决定调用该 skill，才通过 path 读取完整 `SKILL.md`。[OpenAI Tools and Skills][openai-tools-skills]

因此，本教程把 activation 定义为 Skill 的第一个运行时契约：

> Activation 决定 agent 是否会在正确任务中发现并加载某个 Skill。

这个定义是本教程对 Agent Skills spec、Anthropic、OpenAI 和 Microsoft 资料的工程化归纳，不是某一家厂商的官方术语定义。[Agent Skills Spec][agent-skills-spec][Anthropic Agent Skills Overview][anthropic-agent-skills-overview][OpenAI Tools and Skills][openai-tools-skills][Microsoft Adding Skills][ms-adding-skills]

## 2.2 Metadata 不是文档，而是路由基础设施

`description` 最容易被误写成简介，例如“帮助处理文档”“提升代码质量”“用于研究”。这种写法的问题不是不礼貌，而是不可路由。Agent Skills spec 明确要求 description 说明 skill 做什么、什么时候使用，并把过于笼统的描述列为坏例子。[Agent Skills Spec][agent-skills-spec]

Claude Code 文档也说明，description 会帮助 Claude 决定什么时候自动使用 skill；Microsoft Agent Framework 则要求 description 包含帮助 agent 识别相关任务的关键词。[Claude Code Skills][claude-code-skills][Microsoft Agent Skills][ms-agent-skills]

所以，`description` 应该被写成 router prompt，而不是 marketing copy。它应该回答四个问题：这个 skill 处理什么任务、什么时候使用、用户可能怎么表达、什么时候不要使用。[Agent Skills Spec][agent-skills-spec][Claude Code Skills][claude-code-skills][Microsoft Adding Skills][ms-adding-skills]

一个弱 description 通常只说能力范围：

```markdown
description: Helps with documents.
```

一个更好的 description 会说清触发对象、任务动作和边界：

```markdown
description: Use when the user asks to draft, revise, or validate a long-form tutorial chapter with cited primary sources and a chapter-level Sources section. Do not use for one-off chat replies or uncited brainstorming.
```

这不是为了写得更长，而是为了让 agent 能区分“该用”和“不该用”。过宽的 description 会导致误触发，过窄的 description 会导致漏触发；Claude Code troubleshooting 也把 skill not triggering 和 triggers too often 作为两类不同问题处理。[Claude Code Skills][claude-code-skills]

## 2.3 Progressive Disclosure：三层加载模型

Skill 的上下文设计可以理解为三层加载模型。

第一层是 startup metadata：agent 先看到 `name` 和 `description`，用它们判断任务是否相关。[Agent Skills Spec][agent-skills-spec][Anthropic Agent Skills Overview][anthropic-agent-skills-overview]

第二层是 activation body：一旦 skill 被选中，agent 读取 `SKILL.md` 正文，获得主要步骤、限制、输出标准和资源路由。[Agent Skills Spec][agent-skills-spec][OpenAI Tools and Skills][openai-tools-skills]

第三层是 execution resources：`references/`、`assets/`、`scripts/` 等内容不应默认全部进入上下文，而是在当前任务确实需要时再读取或执行。[Agent Skills Spec][agent-skills-spec][Anthropic Best Practices][anthropic-best-practices][Microsoft Agent Skills][ms-agent-skills]

这三层模型带来一个重要写作原则：

> routing facts belong in `description`; operating procedure belongs in `SKILL.md`; depth belongs in supporting resources.

这句话是本教程对 progressive disclosure 的写作归纳，依据来自 Agent Skills spec、Anthropic best practices 和 Microsoft Agent Framework。[Agent Skills Spec][agent-skills-spec][Anthropic Best Practices][anthropic-best-practices][Microsoft Agent Skills][ms-agent-skills]

如果把触发条件只写在 `SKILL.md` 正文深处，agent 可能根本不会加载这份正文；如果把长参考资料都塞进 `SKILL.md`，skill 一旦激活就会占用大量上下文。Anthropic best practices 明确提醒，`SKILL.md` 加载后会与对话上下文竞争 token，因此长内容应拆到 references 或 scripts。[Anthropic Best Practices][anthropic-best-practices]

## 2.4 显式调用与自动调用

Skill activation 通常有两种模式：显式调用和自动调用。

显式调用是用户或开发者明确点名某个 skill，例如使用 `/skill-name`、`@skill`、`$skill` 或平台支持的直接调用方式。Claude Code 支持直接调用 skill；OpenAI / ChatGPT / Codex Skills 也支持显式调用的使用模式。[Claude Code Skills][claude-code-skills][OpenAI Skills][openai-skills]

自动调用是模型根据用户请求和 skill metadata 自己判断是否使用某个 skill。Agent Skills spec、Anthropic 和 OpenAI 的 progressive disclosure 模型都依赖 name / description 作为自动发现和激活的入口。[Agent Skills Spec][agent-skills-spec][Anthropic Agent Skills Overview][anthropic-agent-skills-overview][OpenAI Tools and Skills][openai-tools-skills]

显式调用适合高成本、高风险、容易误触发或用户意图必须明确的能力；自动调用适合边界清晰、风险较低、用户经常自然表达的任务。[Claude Code Skills][claude-code-skills][Microsoft Agent Safety][ms-agent-safety]

如果 skill 会触发外部动作、运行脚本、修改文件、连接 SaaS 或产生副作用，应优先考虑显式调用、approval gate、host-supported invocation restriction 或更强的 tool / workflow 边界。Microsoft safety guidance 明确把修改数据、发送通信、购买、访问敏感数据、不可逆操作和广泛影响列为通常需要 approval 的情况。[Microsoft Agent Safety][ms-agent-safety]

## 2.5 Scope：Skill 放在哪里，会影响谁能触发

Activation 不只由文字决定，也由 scope 决定。Claude Code 文档区分 personal、project、enterprise 和 plugin skills；plugin skills 还会带 namespace，这影响 skill 的可见范围和调用方式。[Claude Code Skills][claude-code-skills]

OpenAI 的 Skills 文档也涉及创建、上传、分享、workspace 发布和管理员控制；这说明 skill 的可见性、安装范围和组织权限会影响谁能使用它。[OpenAI Skills][openai-skills]

Microsoft Agent Framework 则从 provider / load / read resources / run scripts 的角度说明 skills 可以由系统发现并按需加载，强调 skill 是由 runtime 通过 metadata 和操作接口管理的能力包。[Microsoft Agent Skills][ms-agent-skills]

因此，写 activation 时不能只问“description 怎么写”，还要问“这个 skill 应该暴露给谁”。个人 skill 可以更贴近个人工作习惯；项目 skill 应围绕 repo 或团队任务；企业 skill 需要更清楚的边界、命名、权限、测试和治理。[Claude Code Skills][claude-code-skills][OpenAI Skills][openai-skills]

一个不成熟的 skill library 往往会把大量宽泛能力暴露给所有上下文，导致 agent 在相似任务里频繁误判。更好的结构是：许多边界清楚、触发词明确、互相不重叠的窄 skill，而不是一个“万能助手”skill。[Agent Skills Spec][agent-skills-spec][Anthropic Best Practices][anthropic-best-practices][Cursor Rules][cursor-rules]

## 2.6 如何写一个好的 description

一个好的 description 应该先写“什么时候用”，再写“能做什么”。Agent Skills spec 要求 description 同时说明 skill 做什么和何时使用；Claude Code 也强调 description 帮助模型决定何时自动使用 skill。[Agent Skills Spec][agent-skills-spec][Claude Code Skills][claude-code-skills]

本教程建议 description 至少包含四类信息：

第一，任务域：说明这是处理什么类型任务，例如教程撰写、代码审查、PDF 表单提取、研究笔记整理、发布前检查。

第二，触发动作：说明用户说出哪些动作时应考虑该 skill，例如 draft、revise、validate、extract、render、evaluate、publish。

第三，输入对象：说明该 skill 作用于什么材料，例如 `SKILL.md`、research note、chapter draft、PowerPoint、PDF、repo changes、MCP server config。

第四，排除条件：如果存在相邻 skill，明确写出 do not use when，避免 routing conflict。

这些是本教程对 description 写作的归纳，依据是 Agent Skills spec 对 description 的要求、Claude Code 对自动触发的说明、Microsoft 对 task-identifying keywords 的要求，以及 Cursor Rules 对 agent-requested rules description 的相邻设计。[Agent Skills Spec][agent-skills-spec][Claude Code Skills][claude-code-skills][Microsoft Agent Skills][ms-agent-skills][Cursor Rules][cursor-rules]

一个实用模板是：

```markdown
description: Use when the user asks to <task action> for <target object/context>, especially when <trigger vocabulary>. Do not use when <near-miss or neighboring skill>.
```

如果平台可能截断或排序 metadata，应把最强触发词放在前面。Claude Code 文档提醒 `description` 和相关触发字段有长度限制或截断行为，因此关键 use case 应靠前。[Claude Code Skills][claude-code-skills]

## 2.7 Activation testing：先测会不会被正确叫醒

很多 Skill 失败，不是因为正文写得差，而是因为它根本没有在正确任务中被激活，或者在不该出现的时候抢了上下文。Activation testing 应该独立于 output testing，成为 Skill 的验收标准之一。[Agent Skills Spec][agent-skills-spec][Anthropic Best Practices][anthropic-best-practices]

本教程建议为每个重要 skill 准备至少五类 activation fixtures：

第一，直接调用样例：用户明确点名 skill，验证显式调用路径可用。

第二，明显隐式触发样例：用户没有点名 skill，但任务与 description 高度匹配，验证自动调用。

第三，模糊样例：用户请求不完整或需要澄清，验证 agent 是否能先问问题，而不是硬触发。

第四，近邻负例：任务看起来相似，但应该由另一个 skill、tool 或普通回答处理，验证 false positive。

第五，多 skill 冲突样例：同一请求可能命中两个 skill，验证 description 是否能帮助 agent 做正确路由。

这些测试类型是本教程对 activation 风险的实践归纳，依据来自 Agent Skills spec 的 discovery / activation 机制、Anthropic best practices 对 realistic testing 的强调，以及 Claude Code 对触发失败和过度触发的 troubleshooting 分类。[Agent Skills Spec][agent-skills-spec][Anthropic Best Practices][anthropic-best-practices][Claude Code Skills][claude-code-skills]

对于团队或企业 skill，activation fixtures 应随 skill 一起维护。第六章会进一步讨论 eval 和 regression；这里先确立原则：activation 是可测试的行为，不是玄学。[OpenAI Tools and Skills][openai-tools-skills][Microsoft Agent Skills][ms-agent-skills]

## 2.8 常见反模式

第一种反模式是 catch-all skill。它通常叫 `assistant-helper`、`document-helper`、`productivity-tools`，description 也写得很宽。这样的 skill 容易误触发，并且一旦触发就把大量无关上下文带进任务。[Agent Skills Spec][agent-skills-spec][Anthropic Best Practices][anthropic-best-practices]

第二种反模式是把触发条件藏在正文里。由于 agent 通常先用 metadata 决定是否读取 `SKILL.md`，正文里的触发条件可能永远没有机会被看到。[Agent Skills Spec][agent-skills-spec][OpenAI Tools and Skills][openai-tools-skills]

第三种反模式是一个巨大的 `SKILL.md`。Anthropic best practices 明确提醒，`SKILL.md` 一旦加载会占用上下文，应该保持简洁，把长材料拆到 references 或 scripts。[Anthropic Best Practices][anthropic-best-practices]

第四种反模式是让高风险 skill 自动触发。涉及外部系统、副作用、敏感数据、不可逆动作或广泛影响时，应该使用显式调用、approval、tool / workflow 边界或平台权限机制。[Microsoft Agent Safety][ms-agent-safety][OpenAI Plugins][openai-plugins]

第五种反模式是把 skill catalog 暴露得过大。邻近的 Cursor Rules 也体现了同样原则：不同规则可以是 always、glob-attached、agent-requested 或 manual；这说明专门上下文应按相关性附加，而不是一股脑常驻。[Cursor Rules][cursor-rules]

## 2.9 本章检查清单

在写 `SKILL.md` 正文之前，先检查 activation：

- `name` 是否短、稳定、可区分。
- `description` 是否说明了做什么、什么时候用、用户可能怎么说。
- 是否写明了至少一个 near-miss 场景。
- 重要触发词是否放在 description 前半段。
- 是否避免了“helps with...”这类泛化描述。
- 这个 skill 的 scope 是否正确：personal、project、enterprise、plugin 或 API-hosted。
- 是否需要显式调用，而不是自动触发。
- 是否有 activation fixtures 覆盖正例、负例、模糊例和冲突例。

这份检查清单是本教程对官方 activation / progressive disclosure 机制的实践化整理，用来把 Skill 设计从“写完再祈祷会触发”转成“先定义路由契约，再写执行正文”。[Agent Skills Spec][agent-skills-spec][Anthropic Agent Skills Overview][anthropic-agent-skills-overview][Claude Code Skills][claude-code-skills][OpenAI Tools and Skills][openai-tools-skills][Microsoft Adding Skills][ms-adding-skills]

## 本章小结

第二章的核心结论是：先设计 activation，再写 instructions。因为 agent 通常先看到的是 `name` 和 `description`，不是完整正文；如果 activation 写错，后面的正文再好也可能不会被加载。[Agent Skills Spec][agent-skills-spec][Anthropic Agent Skills Overview][anthropic-agent-skills-overview][OpenAI Tools and Skills][openai-tools-skills]

一个成熟 Skill 的 description 应该像路由契约：清楚、具体、可测试、能区分相邻能力。正文负责工作流，references 负责深度资料，scripts 负责确定性辅助；而 activation 负责让这些内容在正确时刻出现。[Agent Skills Spec][agent-skills-spec][Anthropic Best Practices][anthropic-best-practices][Microsoft Agent Skills][ms-agent-skills]

下一章将进入 `SKILL.md` 正文写作：当一个 Skill 已经被正确触发后，如何把正文写成可执行的工作流，而不是背景材料或研究笔记。

## Sources

- [Agent Skills Spec][agent-skills-spec]
- [Anthropic Agent Skills Overview][anthropic-agent-skills-overview]
- [Anthropic Best Practices][anthropic-best-practices]
- [Claude Code Skills][claude-code-skills]
- [OpenAI Skills][openai-skills]
- [OpenAI Tools and Skills][openai-tools-skills]
- [OpenAI Plugins][openai-plugins]
- [Microsoft Agent Skills][ms-agent-skills]
- [Microsoft Adding Skills][ms-adding-skills]
- [Microsoft Agent Safety][ms-agent-safety]
- [Cursor Rules][cursor-rules]

[agent-skills-spec]: https://github.com/agentskills/agentskills/blob/main/docs/specification.mdx
[anthropic-agent-skills-overview]: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
[anthropic-best-practices]: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
[claude-code-skills]: https://docs.anthropic.com/en/docs/claude-code/skills
[openai-skills]: https://learn.chatgpt.com/docs/build-skills
[openai-tools-skills]: https://developers.openai.com/api/docs/guides/tools-skills
[openai-plugins]: https://developers.openai.com/plugins/concepts/skills
[ms-agent-skills]: https://learn.microsoft.com/en-us/agent-framework/agents/skills
[ms-adding-skills]: https://learn.microsoft.com/en-us/agent-framework/journey/adding-skills
[ms-agent-safety]: https://learn.microsoft.com/en-us/agent-framework/agents/safety
[cursor-rules]: https://docs.cursor.com/context/rules-for-ai
