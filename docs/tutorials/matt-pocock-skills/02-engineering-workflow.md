# 02 - 从 Setup 到 Code Review 的工程主链路

第一篇讲的是“我只有一个 Todo MVP 想法时，怎样让 AI 先慢下来”。这一篇进入真实仓库：假设你已经有一个可用的 Todo 应用，现在想加入三个能力：给任务打标签、按标签或状态筛选、把不再活跃的任务归档。

这时 AI 编程的问题不再是“能不能更快写代码”。更快写错方向的代码，只会更快制造返工。真正需要的是一串可交接的 workflow artifacts：仓库约定、领域词汇、ADR、spec、tickets、测试、review 结果和 issue 评论。它们让每一位 agent 都知道自己不是在现场发挥，而是在沿着同一条工程主链路工作。

Matt Pocock 在 [AI Hero Skills Catalog](https://www.aihero.dev/skills-catalog) 和 [`mattpocock/skills`](https://github.com/mattpocock/skills) 里的核心 framing 很一致：Skill 是 focused, repeatable workflow。下面的重点不是背命令，而是看到这些 workflow 如何把一个 Todo 功能从“我想加标签”推进到“一个 ticket 可以被实现、验证、review、交接”。

<a id="setup-matt-pocock-skills"></a>
## 先做仓库约定设置

进入一个仓库后，第一步不是安装 Skills。`/setup-matt-pocock-skills` 的作用是配置这个仓库如何与 Skills 协作：issue 放在哪里，triage label 怎么叫，domain docs 怎么读，agent 进入仓库后应该先看哪些约定。

可以这样调用：

```text
/setup-matt-pocock-skills

请检查当前仓库是否已经有 Matt Pocock Skills 需要的协作约定。
如果缺少 issue tracker、triage labels 或 domain docs 说明，请按本仓库实际情况创建。
```

它不是把 `/grill-with-docs`、`/implement` 这些 Skills 安装进项目。Skills 仍然来自你的 Codex 环境；setup 只是让这些 Skills 读懂当前仓库的工作方式。

本仓库里最关键的四个 setup artifacts 是：

| 文件 | 作用 |
| --- | --- |
| `AGENTS.md` | 仓库入口说明。告诉 agent：issue tracker、triage labels、domain docs 分别去哪里看。 |
| `docs/agents/issue-tracker.md` | 说明 issue/spec/ticket 在本地 Markdown 中如何组织，例如 `.scratch/<feature>/spec.md` 和 `.scratch/<feature>/issues/NN-slug.md`。 |
| `docs/agents/domain.md` | 说明进入领域工作前要读 `CONTEXT.md`、`CONTEXT-MAP.md` 和相关 ADR；也说明缺失时不必空喊创建，等 `/domain-modeling` 真有内容再沉淀。 |
| `docs/agents/triage-labels.md` | 把 Skills 里的五个标准 triage role 映射成本仓库实际 label：`needs-triage`、`needs-info`、`ready-for-agent`、`ready-for-human`、`wontfix`。 |

这一步解决的是协作一致性。没有它，agent 可能会把 ticket 写到 GitHub、把评论写进聊天、把 domain 决策埋在临时总结里；有了它，后续 Skills 才知道该把工作落到哪些文件。

<a id="grill-with-docs"></a>
## 用 `/grill-with-docs` 做带文档的澄清

现在回到 Todo 应用。你想说：

```text
帮我给 Todo App 加标签、筛选和归档。
```

这句话太大了。标签是一对多还是多对多？归档后的任务还会出现在筛选结果里吗？归档和完成是不是同一件事？这些回答会影响 UI、数据模型、测试和文档术语，所以不应该只停留在聊天里。

这时用 `/grill-with-docs`：

```text
/grill-with-docs

已有 Todo 应用支持创建任务、完成任务、Today 视图和全部任务视图。
我想新增标签、筛选和归档，但还不确定这些概念的边界。
请先读取仓库协作约定和领域文档，再追问我。
目标不是立刻写 spec，而是澄清术语、行为边界和需要沉淀的决策。
```

一个短对话可能是：

```text
Codex: “标签”是自由文本，还是用户先创建标签再分配给任务？
你: 第一版用用户创建的标签，避免同义词太多。

Codex: 一个任务能有多个标签吗？如果只能有一个，筛选会简单很多。
你: 可以多个。任务可能同时属于“工作”和“写作”。

Codex: “归档”和“完成”是否独立？比如一个未完成任务能否被归档？
你: 归档是隐藏不活跃任务，和完成状态独立。未完成任务也可以归档。

Codex: 默认任务列表是否显示归档任务？
你: 不显示。需要一个 Archive 入口才能看。

Codex: 标签筛选是否包含归档任务？
你: 默认不包含；在 Archive 视图里再按标签筛选归档任务。
```

注意：`/grill-with-docs` 不是自动生成完整 spec。它先把讨论中会影响仓库语言和长期维护的部分问清楚，并识别哪些内容该进入 `CONTEXT.md` 或 ADR。等澄清足够稳定，再交给 `/to-spec` 合成正式规格。

<a id="domain-modeling"></a>
## 用 `/domain-modeling` 保存领域语言

当讨论里出现“任务”“标签”“归档”“筛选”这些词时，最危险的不是代码不会写，而是每次会话都重新定义一遍。`/domain-modeling` 的价值，是把已经澄清的语言沉淀到 domain artifacts 里。

在单上下文仓库里，核心文件通常是：

- `CONTEXT.md`：共享领域词汇表。比如定义 `Task`、`Tag`、`Archived task`、`Active task`、`Filter`。
- `docs/adr/`：记录难逆转、反直觉或带权衡的决定。比如“归档状态独立于完成状态”就值得写 ADR，因为很多人会自然以为完成和归档是一回事。

可以这样调用：

```text
/domain-modeling

请把刚才 Todo 标签、筛选、归档讨论中已经确定的领域语言沉淀下来。
如果只是术语定义，更新 CONTEXT.md。
如果是有取舍、以后容易被误改的决定，请写 ADR。
```

可能沉淀出的内容是：

```text
CONTEXT.md
- Task: 用户记录的一项待办事项。
- Tag: 用户创建并分配给 Task 的分类标签；一个 Task 可以有多个 Tag。
- Archived task: 被用户从默认活跃列表中隐藏的 Task；归档不等于完成。
- Active task: 未归档的 Task，是默认列表和普通筛选的范围。

docs/adr/0001-archive-is-independent-from-completion.md
- 决策：archive 与 completed 是两个独立状态。
- 原因：用户可能想隐藏暂时不做但仍未完成的任务。
- 后果：默认列表排除 archived；Archive 视图可以继续按标签筛选。
```

这一步不是文档洁癖。它是在减少未来 prompt 的长度：下次你说“archive task”，agent 应该先读 `CONTEXT.md` 和 ADR，而不是重新猜你的意思。

这里有两个边界要守住。

第一，`CONTEXT.md` 是 glossary，不是 spec，也不是 scratchpad。它应该定义稳定术语，比如 `Archived task` 是什么；不要把待办事项、实现方案、开放问题都塞进去。那些内容应该进入 spec、ticket、issue comment 或 handoff。

第二，ADR 应该稀有。只有一个决定难逆转、没有上下文会显得反直觉、并且真的包含取舍时，才值得写 ADR。比如“归档独立于完成状态”值得记录；“按钮放左边还是右边”通常不值得写成架构决策。

<a id="wayfinder"></a>
## 用 `/wayfinder` 先画出未知地图

如果目标只是“给 Todo 加标签、筛选、归档”，`/grill-with-docs` 通常够用。但如果方向膨胀成“把 Todo App 变成团队任务管理工具”，未知点就太多了：权限、协作、通知、审计、评论、分配人、实时同步、迁移路径，每个都可能改变架构。

这时不要硬写 spec，用 `/wayfinder`：

```text
/wayfinder

Todo 应用可能要从个人工具升级成轻量团队任务管理。
请不要直接写 spec。请先创建一张未知地图，把必须先回答的问题拆成 research、prototype、grilling 或 task 类型的 tickets，并标出阻塞关系。
```

在本仓库的本地 Markdown issue tracker 中，`/wayfinder` 会倾向于形成：

- `.scratch/<effort>/map.md`：当前 Notes、Decisions-so-far、Fog。
- `.scratch/<effort>/issues/01-*.md`：一个个 map issue，带 `Type:` 和 `Status:`。
- `Blocked by:`：说明哪些问题必须先解决。

`/wayfinder` 的产物不是实现计划，而是探索计划。它适合“我们还不知道自己不知道什么”的阶段。

当 `/wayfinder` 的某些问题被解决后，不要把 map issue 直接当实现 ticket。先把决策回流到主线：如果它改变了需求，回到 `/to-spec`；如果它只补足了拆票依据，回到 `/to-tickets`；如果它改变了领域语言，再补一次 `/domain-modeling`。Wayfinder 的目标是清雾，不是绕过 spec。

<a id="to-spec"></a>
## 用 `/to-spec` 合成正式规格

当 `/grill-with-docs` 已经把标签、筛选、归档问清楚，且 domain docs 里也有了稳定语言，就可以进入 `/to-spec`。

```text
/to-spec

请根据刚才关于 Todo 标签、筛选、归档的讨论，以及仓库中的 CONTEXT.md 和 ADR，
合成一份可构建 spec。
请包含问题背景、目标、非目标、用户故事、实现决策和验收标准。
```

`/to-spec` 不是从零发明需求，而是把已有讨论综合成正式规格。好的 spec 应该让后续 agent 不需要读完整聊天，也能知道：

- 为什么要做：减少活跃列表噪音，让任务可按主题组织。
- 要做什么：标签管理、任务标签分配、标签筛选、归档/取消归档、Archive 视图。
- 不做什么：团队协作、分享标签、智能推荐、跨设备同步。
- 怎么验收：默认列表隐藏归档任务；标签筛选只看 active tasks；Archive 视图可筛选 archived tasks；归档不改变完成状态。

这份 spec 是后续 `/to-tickets` 和 `/code-review` 的参照物。没有 spec，review 只能检查“代码看起来对不对”；有 spec，review 才能检查“是否实现了当初说好的东西”。

在 Todo 例子里，`/to-spec` 不应该重新问“归档到底是不是完成”。这个问题已经在 `/grill-with-docs` 里回答过，并且可能已经沉淀到 `CONTEXT.md` 或 ADR。`/to-spec` 要做的是把这条共识写成验收标准：归档不改变完成状态；默认列表隐藏归档任务；Archive 视图可以查看和筛选归档任务。

可以把这里的 spec 理解成一份共识契约。`/grill-with-docs` 负责追问、读仓库、识别事实和决策；`/domain-modeling` 负责沉淀稳定语言；`/to-spec` 不重新访谈，而是把已经达成的 shared understanding 写成后续工作能引用的 artifact。

所以 spec 稳定之后，主要精力不应该继续反复润色 spec 文本，而是检查下一步的 tickets 是否真的能执行、验证和并行推进。Spec 定义 destination；tickets 才是 journey。

<a id="to-tickets"></a>
## 用 `/to-tickets` 拆垂直切片

spec 仍然太大，不适合一次交给 agent AFK 实现。`/to-tickets` 会把它拆成可以独立实现、独立验证的 work units。

```text
/to-tickets

请把 Todo 标签、筛选、归档 spec 拆成本地 Markdown tickets。
每个 ticket 都要是一个垂直切片：包含数据、UI、测试和验收。
请标出 parent-child 和 blocking 关系。
```

一个合理拆法可能是：

| Ticket | 内容 | Blocking |
| --- | --- | --- |
| 01 | 建立任务标签数据模型和基础测试 | 无 |
| 02 | 在任务编辑 UI 中分配/移除标签 | blocked by 01 |
| 03 | 增加 active task 的标签筛选 | blocked by 01, 02 |
| 04 | 增加归档/取消归档行为和 Archive 视图 | blocked by 01 |
| 05 | 在 Archive 视图中按标签筛选归档任务 | blocked by 03, 04 |

这里的 issue 不是只指 bug，而是任何被跟踪的工作项。Spec 描述“为什么和验收”；ticket 是“可由 agent 执行的一块工作”；comments 记录执行事实和交接信息；blocking relationships 描述顺序；parent-child relationships 描述拆解。

<a id="ticket-review-checklist"></a>
### Review tickets 的六个问题

`/to-tickets` 生成之后，不要只看数量是否合理。真正要 review 的是每张 ticket 是否适合一个 fresh context 里的 agent 执行：

- 它是不是 vertical slice：能贯穿数据、行为、UI 或接口、测试和验收，而不是只做 schema、只做 API、只做 UI。
- 它是不是 tracer bullet：先打通一条小的端到端路径，暴露真实集成问题，而不是一次铺完整层。
- 它有没有 blocking edges：谁先谁后、哪些能并行，应该在 ticket 里看得出来。
- 它能不能 fresh context 完成：agent 不需要依赖长聊天记忆，ticket body、spec 和 comments 已经足够。
- 它能不能独立交付反馈：完成后能 demo、能跑测试、能被验收。
- 它是不是太大：如果一个 ticket 同时包含多个独立反馈路径，就应该拆小。

Todo 标签功能里，`建立标签数据模型` 如果只改数据层，可能太横向；`让任务可以创建并显示一个标签，同时用测试锁住保存行为` 更像 tracer bullet。后者小一点，但能更早暴露 store、UI、持久化和测试接缝是否顺。

<a id="implement"></a>
## 用 `/implement` 执行一个 ticket

到了 `/implement`，才真正进入交付。它适合拿一个已经 `ready-for-agent` 的 ticket，让 Codex 自己读取 spec、修改代码、运行验证、做 review、更新 issue，最后提交。

```text
/implement

请实现：
.scratch/todo-tags/issues/03-filter-active-tasks-by-tag.md

参考总 spec：
.scratch/todo-tags/spec.md
```

`/implement` 是外层执行 Skill。也就是说，它负责这整个 ticket 的生命周期：读上下文、理解验收、修改文件、运行测试、检查 diff、更新 issue 评论、提交当前 ticket。它不是“请写代码”的同义词，而是“请把这个 ticket 交付掉”。

在实现过程中，它可以在合适的接缝调用 `/tdd`。例如筛选逻辑很适合先写失败测试；但更新一篇 Markdown 教程这样的纯文档 ticket，就不一定适合 TDD，验证重点会变成链接、清单和 review。

三者的关系可以这样看：

```text
spec + ticket
  -> /implement
       -> 在适合的行为接缝使用 /tdd
       -> 经常跑 typecheck、单测或页面检查
       -> 完成后调用 /code-review
       -> 更新 issue comment，提交当前 ticket
```

`/implement` 管外层交付，`/tdd` 管红绿反馈，`/code-review` 管交付后的两轴检查。它们不是三条并列路线，而是一条 ticket 生命周期里的不同层次。

<a id="tdd"></a>
## `/tdd` 是实现内部的红绿循环

`/tdd` 不是 `/implement` 之后才补上的仪式。它通常是 `/implement` 内部的工作方法：先让测试失败，再写最少代码让它通过，最后重构。

对 Todo 标签筛选来说，一个内部 TDD 切片可能是：

```text
/tdd

为 active task 的标签筛选写测试。
规则：默认不包含 archived tasks；选择 tag=work 时，只返回 active 且带 work 标签的任务。
```

红色测试可能表达：

```text
given:
- Task A: active, tags [work]
- Task B: active, tags [home]
- Task C: archived, tags [work]

when:
- filter active tasks by tag "work"

then:
- returns Task A only
```

这能保护实现不偷懒：不能只按标签筛选，也不能把 archived task 混进默认结果。`/implement` 管交付边界，`/tdd` 管反馈循环；一个是外层执行，一个是内部方法。

<a id="feedback-layers"></a>
## 三层反馈：不只看测试是否绿

Todo 标签功能交给 AI 做时，反馈至少有三层。

第一层是底层反馈：TDD、typecheck、单测、完整测试套件、浏览器或手工检查。它回答“这个行为有没有真的跑起来”。比如 active task 的标签筛选必须用失败测试先证明规则存在，再实现。

第二层是架构反馈：tracer bullet 打通后，观察模块边界、测试接缝、数据流和集成路径是否合理。比如筛选逻辑如果散在多个 React component 里，就说明后续可能需要 `/codebase-design` 或 `/improve-codebase-architecture`。

第三层是业务反馈：用 spec、ticket 验收标准和 `/code-review` 的 Spec 轴检查是否做了正确的东西。比如代码通过测试，但把 archived task 也混进默认筛选结果，就仍然不符合业务规则。

这三层反馈让 `/implement` 不只是“把代码写完”，而是每个切片都能被验证、被审查、被继续交接。

<a id="code-review"></a>
## 用 `/code-review` 关闭反馈环

当一个 ticket 完成后，最后一步不是“看起来可以”。`/code-review` 会把 diff 同时放到两个坐标系里看：

- Standards：是否符合仓库已有标准，以及基本代码气味检查。
- Spec：是否忠实实现了原始 spec 和 ticket 验收。

可以这样调用：

```text
/code-review main

请 review 当前分支相对 main 的 diff。
Spec 来源是 .scratch/todo-tags/spec.md 和当前 ticket。
```

这一步特别重要，因为 AI 很擅长写出局部合理的代码，却可能偏离原始意图。比如它实现了标签筛选，却忘了“默认筛选不包含归档任务”；或者它做了 Archive 视图，却把 completed 和 archived 绑定在一起。`/code-review` 的价值就是把这些偏差在合并前暴露出来。

<a id="ticket-lifecycle"></a>
## Ticket 生命周期与 QA 失败处理

Review 或 QA 发现问题时，先判断它属于哪一种。

如果失败属于当前 ticket 的验收标准，就不要新开话题把它绕过去。把失败证据写回当前 ticket 的 comment：复现步骤、失败测试、截图、review finding 或缺失的验收项，然后继续修这个 ticket。比如 `03-filter-active-tasks-by-tag` 忘了排除 archived tasks，这就是当前 ticket 没过。

如果发现的是相关但独立的新需求、优化或 bug，就新建 ticket，而不是塞进当前 ticket。比如做标签筛选时突然想到“标签应该支持颜色和排序”，这很可能是新切片。这样做的目的不是流程洁癖，而是防止 scope creep 把一个 agent session 推到过大的上下文里。

Issue comment 是过程证据层。按本仓库约定，它追加在对应 issue 文件的 `## Comments` heading 下。它不替代 spec，也不替代代码；它记录当前 ticket 执行中发生了什么、验证了什么、失败在哪里、下一位 agent 应该从哪里继续。

<a id="triage"></a>
## 用 `/triage` 处理原始输入

`/triage` 用来处理外部来的原始 issue，而不是处理 `/to-tickets` 已经拆好的实现 ticket。

比如有人提交：

```text
Todo 列表太乱了，希望能整理一下。
```

这不是 ready-for-agent。`/triage` 应该判断它需要更多信息，还是能转成 grilling/spec 工作。它会使用 `docs/agents/triage-labels.md` 里的五个角色，比如 `needs-info` 或 `ready-for-agent`。不要把 `/triage` 当作 `/to-tickets` 的替代品：前者处理入口质量，后者拆解已经明确的 spec。

<a id="diagnosing-bugs"></a>
## 用 `/diagnosing-bugs` 建立红色反馈

如果标签筛选上线后出现 bug，比如 Archive 视图里筛选 `work` 标签时漏掉部分归档任务，不要先猜。用 `/diagnosing-bugs`：

```text
/diagnosing-bugs

Archive 视图按 work 标签筛选时结果不完整。
请先复现并建立失败反馈，再定位原因。
```

它的重点是先得到红色反馈：失败测试、可复现步骤、错误日志或最小复现。没有红色反馈的修 bug，本质上仍然是在猜。

<a id="prototype"></a>
## 用 `/prototype` 回答一个设计问题

`/prototype` 适合低成本回答一个设计问题，而不是顺手开始搭正式系统。

在 Todo 标签功能里，一个好问题是：

```text
/prototype

我不确定标签筛选应该放在顶部横向 chip，还是侧边栏。
请做一个可丢弃原型，只回答“活跃任务列表中怎样切换标签筛选最顺手”。
```

原型的结果可以回流到 spec；原型代码本身不一定进入主线。

<a id="research"></a>
## 用 `/research` 做可追溯调研

如果需要外部资料，比如想参考其他任务管理工具如何处理 archive 与 completed，可以用 `/research`：

```text
/research

请调研主流任务管理工具中 archive、complete、label/filter 的交互区别。
把来源、观察和对本 Todo App 的建议写成仓库内 Markdown。
```

`/research` 的关键是可追溯：结论要带来源，产物要留在仓库，而不是只留在一次聊天里。

<a id="shaping-feedback"></a>
## 让 shaping 结果回流

`/wayfinder`、`/research` 和 `/prototype` 都不是主线的替代品。它们回答的是“我们还缺哪种输入”。

Todo 功能里，如果 `/research` 发现主流工具通常把 complete 和 archive 分开处理，这个结论应该回到 `/grill-with-docs` 或 `/to-spec`，变成明确需求和验收标准。不要让 research note 直接跳到 implementation。

如果 `/prototype` 证明顶部 chip 比侧边栏更适合标签筛选，也不要把 prototype 代码直接硬化进主线。先把结论写回 spec 或 ticket：筛选入口放在哪里、交互如何验收、哪些原型代码明确丢弃。

如果 `/wayfinder` 解决了团队 Todo 的权限模型问题，它的答案应该沉淀成决策、spec 或后续 tickets。Map 是探索工具，不是最终交付物。

<a id="improve-codebase-architecture"></a>
## 用 `/improve-codebase-architecture` 找架构改进点

当你没有明确功能 ticket，只是感觉 Todo 代码越来越难改，可以用 `/improve-codebase-architecture`。

```text
/improve-codebase-architecture

请检查 Todo 应用中任务状态、筛选和视图逻辑的模块边界。
找出最值得拆分或加深的地方，并沉淀为可执行改进 tickets。
```

它不应该随手重构一大片代码，而是先发现架构压力，再把改进变成可排期、可验证的工作。

交付一个功能后，不要立刻忘掉架构健康。AI 让代码增量变快，也会让边界混乱变快。每完成一波 tickets，可以回头看一次：新逻辑有没有让某个 component 背太多领域判断？测试接缝是不是变清楚了？是否出现了值得加深的模块？这些问题适合交给 `/improve-codebase-architecture` 或 `/codebase-design`，再沉淀成新的改进 tickets。

<a id="codebase-design"></a>
## 用 `/codebase-design` 讨论模块设计

当问题已经收窄到模块边界，就适合 `/codebase-design`。比如：筛选逻辑应该放在 React component、store selector，还是 domain service？

```text
/codebase-design

请帮我讨论 Todo 筛选逻辑的模块边界。
目标是让标签筛选、归档筛选和 Today 视图规则都可测试，但 UI component 不背太多领域判断。
```

这类讨论会用“深模块”“接口”“接缝”等词汇帮助你做设计判断。它服务的是模块形状，不是直接实现整个功能。

<a id="smart-zone"></a>
## 别把所有事情塞进同一个上下文

AI 工作不是上下文越长越好。会话越长，agent 越容易丢掉细节之间的关系；ticket 越大，越容易在实现途中开始猜。

Todo 例子里，如果一个 ticket 同时要求“标签管理、筛选、归档、Archive 视图、迁移旧数据、重做 UI”，它很可能已经太大。症状通常是：agent 需要反复重读背景、测试范围说不清、review 发现遗漏验收项、或者每次修一个地方又撞出另一个边界。

这时有三种处理方式：

- 用 `/handoff` 压缩当前 live thread，引用已有 spec、ADR、ticket 和 diff，让下一次会话从清晰边界继续。
- 回到 `/to-tickets` 拆小 ticket，让每张只覆盖一个可独立反馈路径。
- 如果问题本身仍然雾很大，用 `/wayfinder`、`/research` 或 `/prototype` 先回答未知点。

不要把 handoff 看成失败。它是让下一个 agent 重新进入清醒上下文的工程动作。

<a id="resolving-merge-conflicts"></a>
## 用 `/resolving-merge-conflicts` 解决冲突

如果一个分支改了 Task 数据结构，另一个分支也改了筛选逻辑，合并时很可能冲突。用 `/resolving-merge-conflicts`：

```text
/resolving-merge-conflicts

当前 merge 在 Todo task model 和 filter selector 上冲突。
请保留双方意图，先解释冲突来源，再做最小必要修改并运行相关测试。
```

冲突解决的重点是理解双方意图，而不是机械选一边。

<a id="writing-great-skills"></a>
## 用 `/writing-great-skills` 学写 Skill

当你已经熟悉这套 workflow，想把自己的重复流程也变成 Skill，可以用 `/writing-great-skills`。

```text
/writing-great-skills

我想把“为本仓库写教程文章并验证 README 锚点”沉淀成一个 Skill。
请教我如何设计触发条件、输入、步骤和验证清单。
```

写 Skill 的目标不是保存一段长 prompt，而是保存一种可重复执行的工作方式：什么时候触发、要读哪些文件、产出什么 artifacts、如何验证。

## 一条可以照抄的主链路

当你在真实仓库里推进一个 Todo 功能时，可以按这条路线走：

```text
1. /setup-matt-pocock-skills
   确认仓库协作约定：issue tracker、triage labels、domain docs。

2. /grill-with-docs
   带着 AGENTS.md、issue tracker 说明和 domain docs 澄清需求。

3. /domain-modeling
   把稳定术语写进 CONTEXT.md，把重要权衡写成 ADR。

4. /wayfinder
   只在目标过大、未知太多时使用，先探索，不急着 spec。

5. /to-spec
   把已经澄清的讨论合成正式规格。

6. /to-tickets
   把 spec 拆成垂直切片和 blocking relationships。

7. /implement
   以单个 ticket 为外层执行单位，完成代码、验证、issue 更新和提交。

8. /tdd
   在 /implement 内部用于适合测试先行的行为接缝。

9. /code-review
   对照 Standards 和 Spec 关闭反馈环。
```

这条链路的核心不是让 AI 更忙，而是让 AI 的每一步都留下可检查、可交接、可复盘的证据。代码只是其中一个 artifact；真正保护工程质量的是整条 workflow。
