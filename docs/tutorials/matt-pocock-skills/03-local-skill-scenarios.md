# 03 - 22 个本地 Skill 的场景速写

这篇是前两篇的补充。它不再重复完整主线，而是把当前本地有效的 Matt Pocock Skills 逐个放进一个具体处境里：你遇到什么问题、该怎样调用、agent 会怎样工作、产物应该流向哪里。

这些场景仍然围绕 Todo 示例，但不要求都塞进同一个功能主线。主线 Skills 可以继续读第二篇；这里更像一本场景手册。

<a id="ask-matt"></a>

## `/ask-matt`：不知道下一步该用哪个 Skill

处境：你刚用 `/grill-me` 问清楚个人 Todo MVP，但还不确定下一步是写 spec、做 prototype，还是直接实现。

```text
/ask-matt

我已经有一段 Todo MVP 的澄清摘要：无登录、本地存储、Today 手动标记、完成后从 Today 隐藏。
我现在最不确定的是视图切换手感。请帮我判断下一步该用哪个 Skill。
```

可能的路由是：如果风险在交互手感，先 `/prototype`；如果需求已经稳定且要进入仓库，走 `/to-spec`；如果仍然有范围问题，继续 `/grill-me` 或升级到 `/grill-with-docs`。

产物不是代码，而是下一步路线。它适合在你知道自己卡住、但不知道该进入哪个流程时使用。

<a id="code-review"></a>

## `/code-review`：同时检查 Standards 与 Spec

处境：`03-filter-active-tasks-by-tag` 已经实现，测试也绿了，但你担心它只是“代码能跑”，未必符合 spec。

```text
/code-review main

请 review 当前分支相对 main 的 diff。
Spec 来源是 .scratch/todo-tags/spec.md，当前 ticket 是 .scratch/todo-tags/issues/03-filter-active-tasks-by-tag.md。
请分别报告 Standards 与 Spec 两个轴的问题。
```

Standards 轴会看仓库风格、模块边界、测试质量和明显代码风险。Spec 轴会看是否真的满足验收，例如默认列表是否排除 archived tasks、标签筛选是否只影响 active tasks。

产物是 review findings。当前 ticket 的验收失败应回到当前 ticket 修复；相关但独立的新想法应该变成新 ticket。

<a id="codebase-design"></a>

## `/codebase-design`：讨论模块边界和深模块

处境：标签筛选逻辑开始散落在多个 React component 里，测试也只能从 UI 入口绕进去。

```text
/codebase-design

请讨论 Todo 筛选逻辑的模块边界。
目标是让标签筛选、归档筛选和 Today 视图规则都能通过稳定接口测试，
同时让 UI component 不承担过多领域判断。
```

好的讨论会收敛到模块形状：筛选规则是否应该放进 selector、domain service 或 store adapter；哪些接口是测试接缝；哪些细节应该藏在深模块内部。

产物通常是设计建议或改进 ticket，不是顺手重构整个仓库。

<a id="diagnosing-bugs"></a>

## `/diagnosing-bugs`：先复现，再修 bug

处境：Archive 视图按 `work` 标签筛选时漏掉了一部分归档任务。

```text
/diagnosing-bugs

Archive 视图按 work 标签筛选时结果不完整。
请先复现问题并建立失败反馈，再定位原因；不要直接猜修复。
```

agent 应先找到红色反馈：失败测试、复现步骤、日志或最小复现。只有红了，修复才有靶子。

产物是复现证据和修复方向。后续可以进入当前 bug ticket 的实现，或把独立发现写成新 ticket。

<a id="domain-modeling"></a>

## `/domain-modeling`：把稳定术语和关键决定写下来

处境：你已经确认 `Archived task` 不等于 `Completed task`，而且一个任务可以有多个标签。

```text
/domain-modeling

请把 Todo 标签、筛选和归档中已经稳定的领域语言沉淀下来。
术语定义写入 CONTEXT.md；只有难逆转、反直觉、有真实权衡的决定才写 ADR。
```

`CONTEXT.md` 适合保存 glossary，例如 `Task`、`Tag`、`Archived task`、`Active task`。ADR 只记录高门槛决策，例如“归档状态独立于完成状态”。

产物是共享语言。下一次 `/grill-with-docs`、`/to-spec` 或 `/implement` 都应该先读它，而不是重新猜术语。

<a id="grill-me"></a>

## `/grill-me`：没有仓库上下文时先追问

处境：你只有一句“我想做一个个人 Todo App”，还没有仓库、spec 或设计稿。

```text
/grill-me

我想做一个个人 Todo MVP，但范围很模糊。
请连续追问我，不要写方案或代码。
最后输出已确定范围、明确不做的范围、剩余问题和建议下一步。
```

它会问第一版成功标准、是否需要登录、数据放哪里、Today 视图如何产生、完成任务如何显示等问题。

产物是清晰范围。它适合轻量想法澄清；如果进入真实仓库并会影响术语或 ADR，就升级到 `/grill-with-docs`。

<a id="grill-with-docs"></a>

## `/grill-with-docs`：带着仓库文档追问

处境：已有 Todo 应用要加入标签、筛选、归档，这些概念会影响命名、数据结构和测试。

```text
/grill-with-docs

我想给已有 Todo 应用加入标签、筛选和归档。
请先读取 AGENTS.md、issue tracker 说明和 domain docs，再追问我。
目标是澄清术语、行为边界和需要沉淀的决策，不要直接实现。
```

agent 会区分代码库事实和用户决策：已有 store 怎么组织是事实；归档能否作用于未完成任务是决策。

产物是 shared understanding、待更新的 domain language 和下一步建议。澄清稳定后再进 `/domain-modeling` 或 `/to-spec`。

<a id="grilling"></a>

## `/grilling`：追问背后的纪律

处境：你不是想调用某个高层命令，而是想让 agent 在任何需求澄清里问得更锋利。

```text
/grilling

请用 Todo MVP 作为例子，帮我检验这个想法是否足够清楚。
重点追问范围、非目标、验收方式和最容易返工的决定。
```

它会把“你想要哪些功能”换成更有约束的问题：第一成功标准是什么、哪些常见功能第一版不做、哪个决定错了最贵、怎么判断够用了。

产物是更清晰的决策边界。`/grill-me` 和 `/grill-with-docs` 都可以理解为把这套追问纪律放进不同上下文。

<a id="handoff"></a>

## `/handoff`：跨会话保留可执行上下文

处境：当前 session 已经讨论了 Todo 标签功能、改了一部分代码、跑过测试，但上下文变长了。

```text
/handoff

请把当前 Todo 标签功能的上下文整理成 handoff。
引用已有 spec、ADR、ticket、diff 和验证结果；不要复制已经沉淀在文件里的细节。
下一位 agent 应该能直接继续当前 ticket。
```

好的 handoff 不写长篇回忆录，而是指出现有 artifacts、当前状态、未解决问题和下一步。

产物是交接摘要。它让新会话少重复解释，也减少长上下文导致的遗漏。

<a id="implement"></a>

## `/implement`：以 ticket 为外层执行单位

处境：`03-filter-active-tasks-by-tag` 已经 ready-for-agent，body 里有验收标准，spec 也稳定。

```text
/implement

请实现：
.scratch/todo-tags/issues/03-filter-active-tasks-by-tag.md

参考：
.scratch/todo-tags/spec.md
```

`/implement` 负责完整交付：读上下文、修改文件、在适合接缝用 `/tdd`、运行验证、检查 diff、更新 issue comment、提交当前 ticket。

产物是完成的 ticket 和提交。它不是“请写代码”的同义词，而是“请把这张执行单交付掉”。

<a id="improve-codebase-architecture"></a>

## `/improve-codebase-architecture`：发现架构健康问题

处境：Todo 功能连续迭代后，任务状态、筛选和视图逻辑越来越难改，但你还没有明确修哪一处。

```text
/improve-codebase-architecture

请检查 Todo 应用中任务状态、筛选和视图逻辑的模块边界。
找出最值得加深或拆分的地方，并沉淀为可执行改进 tickets。
```

它适合周期性健康检查。agent 应先报告架构压力和候选改进，再把工作变成可验证 ticket。

产物通常是架构改进建议、设计讨论入口或后续 tickets，而不是一次巨大重构。

<a id="prototype"></a>

## `/prototype`：用可丢弃代码回答一个设计问题

处境：你不知道标签筛选应该放在顶部 chips，还是侧边栏。

```text
/prototype

我不确定活跃任务列表里怎样切换标签筛选最顺手。
请做一个可丢弃原型，只回答顶部 chips 和侧边栏哪种更适合这个 Todo App。
```

prototype 的重点是回答问题，不是搭正式架构。如果原型开始被硬化，那就已经不再是 prototype。

产物是设计结论和指向原型的说明。结论通常回流到 `/to-spec`、ticket 验收标准，或在出现新决策时回到 `/grill-with-docs`。

<a id="research"></a>

## `/research`：把外部资料变成可追溯笔记

处境：你想参考主流任务管理工具如何区分 archive、complete 和 label/filter。

```text
/research

请调研主流任务管理工具中 archive、complete、label/filter 的交互区别。
把来源、观察和对本 Todo App 的建议写成仓库内 Markdown。
```

它的产物应该有来源、观察和建议，而不是只在聊天里说“我查了”。研究结论也不直接跳到实现。

如果研究改变需求理解，回到 `/grill-with-docs` 或 `/to-spec`；如果只影响拆票，回到 `/to-tickets`；如果只补背景，留作后续 review 依据。

<a id="resolving-merge-conflicts"></a>

## `/resolving-merge-conflicts`：保留双方意图

处境：一个分支重命名了 Task 状态字段，另一个分支增加了标签筛选，合并时同一段 selector 冲突。

```text
/resolving-merge-conflicts

当前 merge 在 Todo task model 和 filter selector 上冲突。
请先解释双方意图，再做最小必要修改并运行相关测试。
```

这个 Skill 的重点不是机械选 ours 或 theirs，而是理解两边为什么改、哪些行为都必须保留。

产物是冲突解决 diff、解释和验证结果。若冲突暴露更大的设计问题，再新开 `/codebase-design` 或改进 ticket。

<a id="setup-matt-pocock-skills"></a>

## `/setup-matt-pocock-skills`：配置仓库协作约定

处境：你第一次在一个仓库里使用 Matt Pocock Skills，不知道 issue tracker、triage labels 和 domain docs 放在哪里。

```text
/setup-matt-pocock-skills

请检查当前仓库是否已经有 Matt Pocock Skills 需要的协作约定。
如果缺少 issue tracker、triage labels 或 domain docs 说明，请按本仓库实际情况创建。
```

它配置的是仓库约定，不是安装 Skills。典型产物包括 `AGENTS.md`、`docs/agents/issue-tracker.md`、`docs/agents/domain.md` 和 `docs/agents/triage-labels.md`。

下一步通常是进入 `/grill-with-docs`，因为 agent 已经知道该读哪些项目约定。

<a id="tdd"></a>

## `/tdd`：在实现内部建立红绿循环

处境：标签筛选规则很明确，适合先用测试锁住行为。

```text
/tdd

为 active task 的标签筛选写测试。
规则：默认不包含 archived tasks；选择 tag=work 时，只返回 active 且带 work 标签的任务。
```

它会先写失败测试，再写最小实现让测试通过，最后重构。重点是一次一个行为，并且从 public interface 验证。

产物是测试保护下的行为变化。它通常运行在 `/implement` 内部，而不是在实现完成后补仪式。

<a id="teach"></a>

## `/teach`：把仓库变成学习环境

处境：你不只是要做完 Todo，而是想学会这一套 workflow。

```text
/teach

请用 Todo MVP 教我 Matt Pocock Skills 的入门工作流。
每次只讲一个 Skill，让我写一段调用文本，然后点评。
```

`/teach` 会保留学习状态：你学过什么、练过什么、下一步该复习什么。它适合把一次教程阅读变成持续练习。

产物是学习计划、练习反馈和后续复习点。

<a id="to-spec"></a>

## `/to-spec`：把稳定理解合成 buildable spec

处境：`/grill-with-docs` 已经问清楚标签、筛选和归档，domain docs 也沉淀了关键术语。

```text
/to-spec

请根据 Todo 标签、筛选和归档的讨论，以及仓库中的 CONTEXT.md 和 ADR，
合成一份可构建 spec，包含背景、目标、非目标、用户故事、实现决策和验收标准。
```

它不重新访谈，也不从零发明需求。它把已经稳定的 shared understanding 写成后续 tickets、implementation 和 review 都能引用的契约。

产物是 spec。下一步通常是 `/to-tickets`。

<a id="to-tickets"></a>

## `/to-tickets`：拆成可独立实现的垂直切片

处境：Todo 标签功能 spec 已经稳定，但一次性交给 agent 实现太大。

```text
/to-tickets

请把 Todo 标签、筛选和归档 spec 拆成本地 Markdown tickets。
每张 ticket 都要是可独立验证的 tracer-bullet vertical slice，并标出 blocking 关系。
```

好的 ticket 不是横向层切片。它应尽量贯穿数据、行为、UI 或接口、测试和验收，并能在 fresh context 中完成。

产物是 ticket 文件和 blocking 关系。下一步是领取 frontier 上 unblocked 的 ticket，用 `/implement` 执行。

<a id="triage"></a>

## `/triage`：处理外部来的原始 issue

处境：有人提交了一条原始反馈：“Todo 列表太乱了，希望能整理一下。”

```text
/triage

请 triage 这条原始 issue：
Todo 列表太乱了，希望能整理一下。
判断它是否 ready-for-agent；如果不是，请说明需要哪些信息。
```

它处理入口质量，不替代 `/to-tickets`。如果问题太模糊，可能标成 `needs-info`；如果能转成清晰工作，才进入后续 grilling、spec 或 ticket 流程。

产物是 triage label、补充问题或可继续处理的 brief。

<a id="wayfinder"></a>

## `/wayfinder`：为巨大模糊工作画未知地图

处境：Todo App 可能要升级成轻量团队任务管理，不确定权限、协作、通知、审计和同步怎么做。

```text
/wayfinder

Todo 应用可能要从个人工具升级成轻量团队任务管理。
请不要直接写 spec 或 tickets。
请先创建未知地图，把必须先回答的问题拆成 research、prototype、grilling 或 task 类型的 tickets，并标出阻塞关系。
```

它产出探索地图，不产出实现计划。解决 map issue 后，结论通常回到 `/to-spec` 或 `/to-tickets`；如果改变领域语言，再补 `/domain-modeling`。不要把 `/wayfinder` 描述成通常回到 `/grill-with-docs`。

<a id="writing-great-skills"></a>

## `/writing-great-skills`：把自己的流程写成 Skill

处境：你发现自己经常写教程、验证 Markdown 锚点、检查 README 链接，想把这套动作沉淀下来。

```text
/writing-great-skills

我想把“为本仓库写教程文章并验证 README 锚点”沉淀成一个 Skill。
请教我如何设计触发条件、输入、步骤、产物和验证清单。
```

好 Skill 保存的是可重复工作方式，不是一段很长的万能 prompt。

产物是 Skill 设计草案：什么时候触发、先读什么、怎么执行、产出哪些 artifacts、如何验证。

