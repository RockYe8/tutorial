# Research: Matt Pocock Skills Workflow Usage Insights

## Executive Summary

1. Matt Pocock 对这套 Skills 的核心 framing 不是“更长的 prompt”，而是“small, easy to adapt, composable”的工程工作流；它们用于保留开发者控制权，而不是让一个大流程接管全部过程。来源：[mattpocock/skills README](https://github.com/mattpocock/skills)。
2. `/grill-with-docs` 和 `/to-spec` 之间的关系很适合解释成“共识契约”：前者通过一问一答、代码库阅读、`CONTEXT.md` 和 ADR 沉淀 shared understanding；后者不重新访谈，只把已经达成的理解合成为 spec。来源：[AI Hero /grill-with-docs](https://www.aihero.dev/skills-grill-with-docs)、[AI Hero /to-spec](https://www.aihero.dev/skills-to-spec)。
3. “spec/PRD 之后不应反复纠结 spec 文本，而应 review tickets 是否可执行”是合理教程心法，但需要标注为用户推导：Matt 明确说 spec 是 destination，tickets 是 journey；没有看到他直接说“不要主要 review spec”。来源：[5 Agent Skills I Use Every Day](https://www.aihero.dev/5-agent-skills-i-use-every-day)、[AI Hero /to-tickets](https://www.aihero.dev/skills-to-tickets)。
4. `/to-tickets` 的 ticket review 标准有很强 primary source 支撑：ticket 应是 tracer-bullet vertical slice，贯穿 schema/API/UI/tests 等层；不是 horizontal slice；每个 ticket 声明 blocking edges；可在 frontier 上被独立领取；并建议“one ticket per fresh context”。来源：[AI Hero /to-tickets](https://www.aihero.dev/skills-to-tickets)、[Tracer Bullets](https://www.aihero.dev/tracer-bullets)。
5. 三层 feedback 可以作为教程模型：底层 TDD/typecheck/tests 有直接依据；架构层 feedback 可由 tracer bullet、deep module、pre-agreed seam 和 improve-codebase-architecture 支撑；业务层 feedback 由 spec/code-review 的 Spec axis 支撑。三层命名本身是用户推导，但证据链扎实。
6. `/implement` 是外层执行 skill；它不决定做什么，而是在已 settled 的 spec/tickets/seams 上执行，内部驱动 `/tdd`，经常跑 typecheck 和单测，末尾调用 `/code-review`。来源：[AI Hero /implement](https://www.aihero.dev/skills-implement)、[AI Hero /tdd](https://www.aihero.dev/skills-tdd)、[AI Hero /code-review](https://www.aihero.dev/skills-code-review)。
7. `/code-review` 不是“最后看一眼”，而是实现后反馈机制：Standards 和 Spec 两轴分开，由并行 sub-agents 分别判断“built right”和“right thing”。来源：[AI Hero /code-review](https://www.aihero.dev/skills-code-review)、[v1.1 changelog](https://www.aihero.dev/skills/skills-changelog-v1-1-wayfinder-to-spec-to-tickets-grilling-improvements)。
8. QA/ticket 生命周期里，“不符合验收标准就打回当前 ticket”与 Spec axis/verification 思路一致；“相关但独立的 bug/优化/新需求应新建 ticket”没有找到 Matt 的直接表述，应标注为用户推导/团队实践。
9. `/triage` 处理的是 tracker 里外部来的 raw issues/PRs：分类、验证、补 brief、进入 ready-for-agent；它不是 `/to-tickets` 的替代品。来源：[AI Hero /triage](https://www.aihero.dev/skills-triage)。
10. Smart zone/context hygiene 是 workflow 的关键：scope 太大会进入模型 dumb zone；大而模糊的工作应拆到 `/wayfinder`，长会话应 `/handoff`，高保真问题应先 prototype 再回到 grill/spec。来源：[9 Things People Get Wrong](https://www.aihero.dev/things-people-get-wrong-with-grill-me-and-grill-with-docs)、[AI Hero /wayfinder](https://www.aihero.dev/skills-wayfinder)、[AI Hero /handoff](https://www.aihero.dev/skills-handoff)。
11. `CONTEXT.md` 和 ADR 的价值不是“补文档”，而是减少重复解释：glossary 记录 canonical terms，ADR 只记录 hard-to-reverse、surprising、有 trade-off 的决定。来源：[AI Hero /domain-modeling](https://www.aihero.dev/skills-domain-modeling)、[AI Hero /grill-with-docs](https://www.aihero.dev/skills-grill-with-docs)。
12. 最值得加入当前教程的新内容是“工作流心法”小节：spec 是共识契约、ticket 是可执行反馈单元、feedback loops 贯穿全程、smart zone 决定何时 handoff/wayfinder/prototype、Skills 小而可组合而不是全自动流水线。

## Source Map

- [mattpocock/skills README](https://github.com/mattpocock/skills)：说明 Skills 的设计哲学、安装方式、common failure modes、主技能清单、user-invoked/model-invoked 区分。
- [AI Hero Skills overview](https://www.aihero.dev/skills)：把 skill set 分成 Getting Started、Main Flow、Shaping、Upkeep、Non-Coding、Reference，并明确 main flow 是 idea-to-ship spine。
- [skills.sh mattpocock/skills](https://www.skills.sh/mattpocock/skills)：公开 skillset 页面，提供安装命令和 skill 列表/热度，适合用作“公开可安装 skill 页面”证据。
- [AI Hero /grill-with-docs](https://www.aihero.dev/skills-grill-with-docs)：说明 shared understanding、`CONTEXT.md` glossary、ADR、grill engine、何时使用。
- [AI Hero /to-spec](https://www.aihero.dev/skills-to-spec)：说明 `to-spec` 从当前 conversation/codebase understanding 合成 spec，不重新 interview，并包含 user stories、testing decisions、out-of-scope 等。
- [AI Hero /to-tickets](https://www.aihero.dev/skills-to-tickets)：说明 tracer-bullet vertical slice、blocking edges、frontier、fresh context、wide-refactor exception。
- [AI Hero /implement](https://www.aihero.dev/skills-implement)：说明实现阶段不决定做什么，而是执行 settled spec/tickets，使用 pre-agreed seams、TDD、typecheck/tests、code-review。
- [AI Hero /tdd](https://www.aihero.dev/skills-tdd)：说明 red-green loop、一次一个行为、首个 cycle 是 tracer bullet、测试面向 public interface。
- [AI Hero /code-review](https://www.aihero.dev/skills-code-review)：说明 Standards + Spec 两轴 review、并行 sub-agents、没有 spec 时不伪造需求。
- [AI Hero /wayfinder](https://www.aihero.dev/skills-wayfinder)：说明大而模糊、一 session 装不下的工作应先做 decision-ticket map，并用 frontier/fog/blocking 管理未知。
- [AI Hero /research](https://www.aihero.dev/skills-research)：说明 research 是 background agent 做 primary-source legwork，产出带引用 Markdown，供后续 grilling/planning 使用。
- [AI Hero /prototype](https://www.aihero.dev/skills-prototype)：说明 prototype 是 disposable primary source，用来回答 state/UI design question，不进入主线维护。
- [AI Hero /handoff](https://www.aihero.dev/skills-handoff)：说明 handoff 是压缩 live thread，引用已有 spec/ADR/issue/diff，不复制 settled detail。
- [AI Hero /triage](https://www.aihero.dev/skills-triage)：说明 triage 处理 raw issues/PRs，先 verify，再 brief，再进入 ready-for-agent。
- [AI Hero /domain-modeling](https://www.aihero.dev/skills-domain-modeling)：说明 `CONTEXT.md` 是 glossary，不是 spec/scratchpad；ADR 只记录高门槛决策。
- [AI Hero /codebase-design](https://www.aihero.dev/skills-codebase-design)：说明 deep module、interface、seam、leverage、locality 这套共享设计词汇。
- [AI Hero /improve-codebase-architecture](https://www.aihero.dev/skills-improve-codebase-architecture)：说明 periodic health check、deepening opportunities、report then grill。
- [AI Hero: Tracer Bullets](https://www.aihero.dev/tracer-bullets)：说明 AI 容易一次性铺大方案；tracer bullet 是小的端到端切片，用于快速反馈。
- [AI Hero: 9 Things People Get Wrong](https://www.aihero.dev/things-people-get-wrong-with-grill-me-and-grill-with-docs)：说明 grilling 的 scope、smart zone/dumb zone、高保真问题转 prototype、保留 design decisions 等误区。
- [AI Hero: How To Make Codebases AI Agents Love](https://www.aihero.dev/how-to-make-codebases-ai-agents-love)：说明 deep modules、feedback loops、代码库可导航性、AI 像无记忆的新成员。
- [AI Hero Dictionary: Smart Zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone)：说明 context window 的有效工作区间，以及为什么过长上下文会降低 agent 判断质量。
- [AI Hero Dictionary: Attention Degradation](https://www.aihero.dev/ai-coding-dictionary/attention-degradation)：说明上下文变长后 attention relationships 变弱，应通过 clear、compact、handoff 管理上下文。
- [AI Hero Dictionary: Ticket](https://www.aihero.dev/ai-coding-dictionary/ticket)：把 ticket 定义成一次 agent session 的 handoff artifact；如果 session 经常进入 dumb zone，ticket 可能太大。
- [AI Hero: 5 Agent Skills I Use Every Day](https://www.aihero.dev/5-agent-skills-i-use-every-day)：早期主流程表达：grill-me -> PRD -> issues -> TDD -> architecture upkeep，并强调 PRD 是 destination、issues 是 journey。
- [AI Hero: Real-world feature build with Claude Code](https://www.aihero.dev/real-world-feature-build-with-claude-code)：真实 workflow 页面，提到 grill、PRD、issues、AFK agents、QA loops 和真实代码库。
- [AI Hero v1.1 changelog](https://www.aihero.dev/skills/skills-changelog-v1-1-wayfinder-to-spec-to-tickets-grilling-improvements)：解释 `/to-spec`、`/to-tickets` rename，main lifecycle flow，Wayfinder、TDD、code-review 的变化。
- [GitHub Issue #23: The flow](https://github.com/mattpocock/skills/issues/23)：用户公开询问“correct flow”；Matt 标记为 docs gap，并提出需要 happy path flow 文档，说明 workflow composition 是真实需求。
- [GitHub Issue #88](https://github.com/mattpocock/skills/issues/88)：说明把 issue tracker、triage label、domain docs 等假设移出 skill，交给 repo-local prose config。

## Findings

### 1. Spec / PRD 作为共识契约

有直接依据支持“共识契约”这个教程表达，但应写成教程转述，而不是 Matt 原话。`/grill-with-docs` 明确说它持续追问直到你和 agent 达成 shared understanding，并把词汇和 hard decisions 写进 `CONTEXT.md` 与 ADR；`/to-spec` 明确说它不再重新 interview，因为到这个阶段 alignment work 已经完成，只是 synthesize what is already known。来源：[grill-with-docs](https://www.aihero.dev/skills-grill-with-docs)、[to-spec](https://www.aihero.dev/skills-to-spec)。

因此，可以在教程里说：充分 grill、读代码、沉淀 domain language 和 ADR 之后，spec/PRD 是“AI 与开发者共频后的共识契约”。它不是聊天摘要，也不是需求猜测，而是把已经稳定的 shared understanding 写成后续 tickets、implementation、code-review 都能引用的 artifact。

“开发者不应把主要精力放在反复 review spec 本身，而应把重点转向 review tickets 是否可执行、可验证、可并行推进”是合理延伸，但没有找到 Matt 直接这样说。可用来源支持的更稳妥写法是：`to-spec` 的输出定义 destination；`to-tickets` 把 destination 变成 journey；review 的重心应从“还要不要继续想 spec”转为“tickets 是否把 spec 切成可执行的 tracer bullets”。来源：[5 Agent Skills](https://www.aihero.dev/5-agent-skills-i-use-every-day)、[to-tickets](https://www.aihero.dev/skills-to-tickets)。

适合加入教程：非常适合。建议放在第 2 篇 `/to-spec` 与 `/to-tickets` 之间，作为“从共识契约到执行单元”的过渡。

### 2. Ticket Review：Vertical Slice 与 Tracer Bullet

`/to-tickets` 页面直接支持这些 ticket review 标准：每个 ticket 是 tracer-bullet vertical slice，穿过所有集成层，完成后能独立 demo 或 verify；不是 schema/API/UI 这类 horizontal layer-by-layer work。来源：[to-tickets](https://www.aihero.dev/skills-to-tickets)。

`Tracer Bullets` 文章给了更通用的心法：AI 倾向一次性构建完整层，不停下来验证假设；tracer bullet 则先构建一个小的端到端功能，立即测试、获取反馈，然后在 fresh context window 里继续下一片。来源：[Tracer Bullets](https://www.aihero.dev/tracer-bullets)。

blocking edges 也有直接依据：`to-tickets` 把 blockers 写进 ticket；在真实 tracker 上，blockers 变成 native blocking links，任何 blockers done 的 ticket 就在 frontier 上，可以被多个 agents 并行领取；本地 Markdown 则 blockers-first 编号，手动 top-to-bottom。来源：[to-tickets](https://www.aihero.dev/skills-to-tickets)、[v1.1 changelog](https://www.aihero.dev/skills/skills-changelog-v1-1-wayfinder-to-spec-to-tickets-grilling-improvements)。

“每个 ticket 应能在 fresh context window 中完成”有直接依据：`to-tickets` 明确建议 work the frontier one ticket per fresh context。来源：[to-tickets](https://www.aihero.dev/skills-to-tickets)。

AI Hero 的 Ticket 词典也支持这个尺寸约束：ticket 是一次 agent session 的 handoff artifact；如果一个 ticket 经常把 session 推进 dumb zone，说明它可能太大。来源：[Ticket dictionary](https://www.aihero.dev/ai-coding-dictionary/ticket)。

建议教程中的 ticket review checklist：

- 是否是 vertical slice：能贯穿数据、行为、UI/接口、测试/验收。
- 是否是 tracer bullet：能先验证核心链路，而不是先铺完整层。
- 是否有 blocking edges：谁先谁后、哪些能并行，一眼可见。
- 是否能 fresh context 完成：不依赖长聊天记忆，ticket body/spec/comments 足够。
- 是否能独立交付反馈：完成后可 demo、可测试、可 QA。
- 是否过大：如果一个 ticket 同时包含多个可独立反馈的核心路径，应拆小。

适合加入教程：非常适合。建议作为第 2 篇 `/to-tickets` 后的小节，也可在 README 查询表中加入“如何 review tickets”入口。

### 3. Feedback Loops：TDD、架构反馈、业务反馈

底层 feedback 有直接依据。README 说 agent 没有代码运行反馈就会 flying blind，常规 feedback loops 包括 static types、browser access、automated tests；TDD 的 red-green-refactor loop 对 automated tests 很关键。`/tdd` 页面进一步要求 one behaviour at a time、先写 failing test、public interface、expected values 来自 independent source of truth。来源：[README](https://github.com/mattpocock/skills)、[tdd](https://www.aihero.dev/skills-tdd)。

架构层 feedback 有间接但强证据。Tracer bullet 打通第一条端到端链路后，会暴露技术栈、集成、接口和性能上的未知；`to-spec` 会先 sketch testing seams 和 deep module opportunities；`codebase-design` 强调 interface 是 test surface；`improve-codebase-architecture` 是周期性 health check，用 deepening opportunities 改善可测试性、可导航性。来源：[Tracer Bullets](https://www.aihero.dev/tracer-bullets)、[to-spec](https://www.aihero.dev/skills-to-spec)、[codebase-design](https://www.aihero.dev/skills-codebase-design)、[improve-codebase-architecture](https://www.aihero.dev/skills-improve-codebase-architecture)。

业务层 feedback 主要由 spec/ticket acceptance 和 code-review 的 Spec axis 支撑。`code-review` 的 Spec axis 检查 diff 是否实现了 originating issue/spec，是否遗漏要求或引入 scope creep。来源：[code-review](https://www.aihero.dev/skills-code-review)。

“三层 feedback”这个分层没有找到 Matt 直接命名，但可作为教程模型：

- 底层 feedback：TDD、typecheck、single tests、full suite、browser/manual check。
- 架构层 feedback：tracer bullet 后观察 seam、module boundary、integration path、performance bottleneck 是否合理。
- 业务层 feedback：用 ticket 验收标准和 spec stories 做 QA/review。

适合加入教程：非常适合。它能把 `/tdd`、`/implement`、`/code-review` 串成同一条反馈链，而不是三个孤立命令。

### 4. Implement / TDD / Code Review 的关系

`/implement` 是外层执行 skill，有直接依据。它 builds the work described in spec/tickets，通过 TDD、typechecking、full suite，再 review 和 commit；它不决定做什么，spec 已 settled，seams 已 agreed。来源：[implement](https://www.aihero.dev/skills-implement)。

`/tdd` 通常是 `/implement` 内部使用的 red-green 方法，也有直接依据。`/tdd` 页面说它是 main build chain 里写代码的 red-green loop，`implement` drives `tdd` internally；它也可以直接用于 concrete behaviour。来源：[tdd](https://www.aihero.dev/skills-tdd)、[implement](https://www.aihero.dev/skills-implement)。

`/code-review` 是实现后的两轴 review：Standards + Spec，有直接依据。`implement` 在 commit 前调用 code-review；`code-review` 页面明确两轴不合并，因为一个 change 可以过一个轴、不过另一个轴。来源：[code-review](https://www.aihero.dev/skills-code-review)、[v1.1 changelog](https://www.aihero.dev/skills/skills-changelog-v1-1-wayfinder-to-spec-to-tickets-grilling-improvements)。

code review / QA 是否应理解为持续 feedback，而不是最后一次性检查：有部分依据。Matt 的页面把 review 放在 tail，但整个 workflow 强调反馈速度、TDD、tracer bullet、QA loops。更稳妥写法：`/code-review` 是每个实现切片的关闭反馈，不应等到所有大功能完成后才第一次使用。来源：[Tracer Bullets](https://www.aihero.dev/tracer-bullets)、[Real-world feature build](https://www.aihero.dev/real-world-feature-build-with-claude-code)、[code-review](https://www.aihero.dev/skills-code-review)。

适合加入教程：已经有基础内容，但建议补一个关系图：

```text
ticket/spec -> /implement
              -> uses /tdd at agreed seams
              -> runs typecheck/tests
              -> calls /code-review
              -> commit/comment/next ticket
```

### 5. QA、Ticket 打回、新 Ticket 与 Issue Comment

“QA 发现当前 ticket 不符合验收标准时，应打回该 ticket，附失败原因，继续修复”：没有找到 Matt 直接使用“打回 ticket”这个说法，但有足够流程依据。`code-review` 的 Spec axis 对照 issue/spec 找 missing requirements；`triage` 强调 verify before brief；真实功能构建页面也明确提到 messy parts 和 QA loops。建议标注为教程实践：当失败属于当前 ticket 的 acceptance criteria，应把证据写回该 ticket 并继续修复。来源：[code-review](https://www.aihero.dev/skills-code-review)、[triage](https://www.aihero.dev/skills-triage)、[Real-world feature build](https://www.aihero.dev/real-world-feature-build-with-claude-code)。

“相关但独立的 bug、优化点或新需求，应创建新的 ticket，而不是混进当前 ticket”：这是良好的 workflow hygiene，但没有找到直接出处。可由 `code-review` 的 scope creep 检查和 `to-tickets` 的独立 tracer bullet 思路间接支持。建议标注为用户推导/团队约定。

issue comment 记录验证证据、失败原因、澄清、handoff 信息：有部分直接依据。`triage` 会在 tracker 上留下带免责声明的 comment；`wayfinder` 规定 resolving ticket 后写 resolution comment；`handoff` 规定引用 spec/plan/ADR/issue/diff，而不是复制。建议教程写成：comments 是 tracker 上的过程证据层。来源：[triage](https://www.aihero.dev/skills-triage)、[wayfinder](https://www.aihero.dev/skills-wayfinder)、[handoff](https://www.aihero.dev/skills-handoff)。

triage 处理 raw issues，而不是 `/to-tickets` 生成的 agent-ready tickets：有直接依据。`triage` 处理 raw unevaluated reports；`to-spec` 和 `to-tickets` 是从 fresh conversation/spec 往 tracker 里生成 work。来源：[triage](https://www.aihero.dev/skills-triage)、[to-tickets](https://www.aihero.dev/skills-to-tickets)。

适合加入教程：适合新建“Ticket 生命周期与 QA”小节，尤其能补上第 2 篇当前较弱的执行后闭环。

### 6. Context Hygiene、Smart Zone 与 Handoff

`9 Things People Get Wrong` 是最直接的 context hygiene 来源。Matt 提到 scope 过大会撞上 context window，并进入模型 “dumb zone”；解决方式是把大 scope 拆成更小、更 grillable 的 chunks，保持在 smart zone。来源：[9 Things People Get Wrong](https://www.aihero.dev/things-people-get-wrong-with-grill-me-and-grill-with-docs)。

AI Hero 词典进一步把 smart zone/attention degradation 说成上下文管理问题：上下文越长，模型越难保持注意力关系，实践上应通过 clear、compact、handoff 或拆 ticket 来降低风险。不要把某个 token 数写成硬阈值；它应作为“该切上下文了”的经验信号。来源：[Smart Zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone)、[Attention Degradation](https://www.aihero.dev/ai-coding-dictionary/attention-degradation)。

什么时候 `/handoff`：当会话足够长、接近 context limit、要收工或交给另一个 agent 时。handoff 不重复 spec/ADR/issue/diff，只引用这些已有 artifact，携带 live thread 和 next step。来源：[handoff](https://www.aihero.dev/skills-handoff)。

什么时候不要继续同一个上下文：如果 planning scope 太大、会话接近 context 风险、需要另一个 session/agent 接力，或某个问题需要 prototype/research 才能回答，就该分流。对大而 foggy 的工作，用 `/wayfinder`；对高保真 UI/状态问题，用 `/prototype`；对资料查证，用 `/research`。来源：[wayfinder](https://www.aihero.dev/skills-wayfinder)、[prototype](https://www.aihero.dev/skills-prototype)、[research](https://www.aihero.dev/skills-research)、[9 Things People Get Wrong](https://www.aihero.dev/things-people-get-wrong-with-grill-me-and-grill-with-docs)。

适合加入教程：非常适合。建议放入进阶小节，标题可为“别把所有事情塞进同一个上下文”。

### 7. Shared Language、CONTEXT.md 与 ADR

`CONTEXT.md` 的作用有直接依据：共享语言帮助 agent 解码项目 jargon，减少 verbosity，使变量、函数、文件命名更一致，并减少 token 消耗。来源：[README](https://github.com/mattpocock/skills)、[domain-modeling](https://www.aihero.dev/skills-domain-modeling)。

`CONTEXT.md` 不应变成 spec 或 scratchpad，也有直接依据。`domain-modeling` 说它是 glossary and nothing else，无 implementation detail、无 spec、无 scratch pad。来源：[domain-modeling](https://www.aihero.dev/skills-domain-modeling)。

ADR 的写入门槛也有直接依据：只有 hard to reverse、surprising without context、real trade-off 三者都满足时才写；大多数 session 应产出更清晰的 glossary，少量或没有 ADR。来源：[domain-modeling](https://www.aihero.dev/skills-domain-modeling)、[grill-with-docs](https://www.aihero.dev/skills-grill-with-docs)。

适合加入教程：第 2 篇已有基础说明，建议补“不要把 CONTEXT.md 写成百科全书”和“ADR 稀有才有价值”两个反模式。

### 8. Wayfinder、Research、Prototype 的正确使用边界

`/wayfinder` 处理的是 one agent session 装不下、路线仍在 fog 中的大工作；它创建 decision tickets，不直接做 deliverables。它的完成条件是“没有必须先决定的问题了”，之后再回到 `/to-spec` 或主流程。来源：[wayfinder](https://www.aihero.dev/skills-wayfinder)、[v1.1 changelog](https://www.aihero.dev/skills/skills-changelog-v1-1-wayfinder-to-spec-to-tickets-grilling-improvements)。

`/research` 是 primary-source legwork，不是思考外包。研究结果是一个带引用的 Markdown 文件，供后续 grilling、planning、design 使用，而不是直接变成实现。来源：[research](https://www.aihero.dev/skills-research)。

`/prototype` 是回答一个 design question 的 disposable program。完成后保留 answer 和 pointer，prototype 本身不进 main branch；如果开始 harden prototype，就已经不是 prototype。来源：[prototype](https://www.aihero.dev/skills-prototype)。

“为什么 `/research` 的结果要回到 `/grill-with-docs`，而不是直接变成实现”：有直接依据支持“research feeds thinking skills”，但具体是否回到 `/grill-with-docs` 取决于研究是否影响 plan/domain language。建议写法：研究产物应先被人/agent 消化进 spec、grill 或 design decision，再进入 tickets；不要让 research note 直接跳到 implementation。来源：[research](https://www.aihero.dev/skills-research)。

适合加入教程：适合新建“Shaping skills 的边界”小节。

### 9. Codebase Health、Deep Modules 与 Architecture Improvement

Matt 反复强调 AI 时代软件 fundamentals 更重要。AI 写代码更快，也会更快放大 entropy；坏代码库会让 AI 更差。来源：[AI Hero home](https://www.aihero.dev/)、[README](https://github.com/mattpocock/skills)。

Deep modules 是 AI-friendly codebase 的核心实践：大量行为隐藏在小而稳定的 interface 后；tests 锁住 module behavior；AI 可以在 module 内部工作，人类主要把关 interface 和 boundaries。来源：[How To Make Codebases AI Agents Love](https://www.aihero.dev/how-to-make-codebases-ai-agents-love)、[codebase-design](https://www.aihero.dev/skills-codebase-design)。

`/improve-codebase-architecture` 是 periodic maintenance，不是只有出问题才用。AI Hero 页面建议 every few days 或感觉一个概念要在很多小模块之间跳转时使用；5 Agent Skills 文章建议 once a week or after a surge of development。来源：[improve-codebase-architecture](https://www.aihero.dev/skills-improve-codebase-architecture)、[5 Agent Skills](https://www.aihero.dev/5-agent-skills-i-use-every-day)。

适合加入教程：适合第 2 篇尾部或进阶心法，作为“交付后别停止，维护 codebase health 才能让后续 agents 更强”。

### 10. 其他值得加入教程的使用心得

- `/grill-me` vs `/grill-with-docs`：Matt 已更新建议，coding 工作默认更推荐 `/grill-with-docs`，`/grill-me` 保留给只需要轻量 pressure-test、无需 artifacts 的场景。来源：[grill-me](https://www.aihero.dev/skills-grill-me)、[grill-with-docs](https://www.aihero.dev/skills-grill-with-docs)。
- 高保真问题不要硬 grill：UI 手感、复杂表单布局、状态模型手感等需要 prototype；可以 grill -> prototype -> grill。来源：[9 Things People Get Wrong](https://www.aihero.dev/things-people-get-wrong-with-grill-me-and-grill-with-docs)、[prototype](https://www.aihero.dev/skills-prototype)。
- 不要让 grilling 自动跳 implementation：v1.1 changelog 提到新增 confirmation gate，避免 grilling 结束后 agent 直接动手。来源：[v1.1 changelog](https://www.aihero.dev/skills/skills-changelog-v1-1-wayfinder-to-spec-to-tickets-grilling-improvements)。
- 不要自问自答：grilling 改进区分 facts 与 decisions；facts 由代码库回答，decisions 由用户决定。来源：[v1.1 changelog](https://www.aihero.dev/skills/skills-changelog-v1-1-wayfinder-to-spec-to-tickets-grilling-improvements)、[grill-with-docs](https://www.aihero.dev/skills-grill-with-docs)。
- Skills 小而可组合：README 明确反对 GSD/BMAD/Spec-Kit 式接管流程，强调 small/composable/adaptable。来源：[README](https://github.com/mattpocock/skills)。
- not vibe coding：README 直接说这些是 real engineering, not vibe coding；AI Hero home 也强调 bad code 成本更高、software fundamentals essential。来源：[README](https://github.com/mattpocock/skills)、[AI Hero home](https://www.aihero.dev/)。
- 安装方式有两个哲学：skills.sh 把 skills copy 到项目/环境里，方便 hack and customize；Claude Code plugin 是 read-only managed bundle，跟随作者更新。来源：[README](https://github.com/mattpocock/skills)、[skills.sh](https://www.skills.sh/mattpocock/skills)。
- prompt、skill、workflow 区别：Matt 未给出完整概念论文，但 README 和 AI Hero skill pages 支持这样的教程解释：prompt 是一次性指令，skill 是可复用工作纪律，workflow 是多个 skills/artifacts 的组合。
- agents 常见失败模式：misalignment、verbosity、lack of feedback、ball of mud 是 README 四大问题；9 Things 文章补充 scope 过大、passive user、high-fidelity questions、context window 等。来源：[README](https://github.com/mattpocock/skills)、[9 Things People Get Wrong](https://www.aihero.dev/things-people-get-wrong-with-grill-me-and-grill-with-docs)。
- `/to-tickets` 的 wide-refactor exception 很值得加：有些横跨全仓的机械 refactor 无法 vertical slice，应使用 expand-contract。来源：[to-tickets](https://www.aihero.dev/skills-to-tickets)。
- 不要把 `/qa` 写成已确认的独立主线 skill：skills.sh 上能看到 `qa`，但当前 AI Hero 主流程和 promoted engineering skill docs 更明确的是 triage verification、implement checks、code-review、QA loops。教程里应讲“QA 机制/生命周期”，而不是断言存在一个稳定 `/qa` contract。来源：[skills.sh mattpocock/skills](https://www.skills.sh/mattpocock/skills)、[triage](https://www.aihero.dev/skills-triage)、[Real-world feature build](https://www.aihero.dev/real-world-feature-build-with-claude-code)。

### 11. 对当前教程的增强建议

README 适合加入：

- 一张“工作流心法地图”：共识契约 -> tracer-bullet tickets -> implement/TDD -> code-review/QA -> architecture upkeep。
- 在“我遇到 X 用哪个 Skill”表中新增几行：review tickets、QA 打回、smart zone/context 太长、research 结果如何回流。
- 标注当前教程用的是 v1.1 后的新名词：`/to-spec`、`/to-tickets`；早期文章可能叫 `/to-prd`、`/to-issues`。

第 1 篇适合加入：

- `/grill-me` 现在更适合非代码或轻量 pressure-test；真实代码库工作默认升到 `/grill-with-docs`。
- “不要把 Skill 当魔法 prompt”：Skills 是 workflow modules，用户仍要主动 steering。
- 高保真问题需要 prototype，不要在 grill 里硬答。

第 2 篇适合加入：

- `/to-spec` 作为共识契约，而不是重新发现需求。
- `/to-tickets` review checklist：vertical slice、tracer bullet、blocking edges、fresh context、独立验收、过大拆分。
- 三层 feedback：底层、架构层、业务层。
- `/implement`/`/tdd`/`/code-review` 关系图。
- QA/ticket 生命周期：当前 ticket 的验收失败就打回；相关但独立的变化新建 ticket；issue comment 记录证据。

建议新建“进阶心得/工作流心法”小节：

- Smart zone/context hygiene：什么时候 `/handoff`，什么时候 `/wayfinder`。
- `CONTEXT.md` 与 ADR 的边界：glossary only，ADR 稀有。
- research/prototype/wayfinder 的 shaping 边界。
- codebase health：deep modules、architecture improvement 的日常维护。

建议新增 ticket：

`D:/Project/tutorial/.scratch/matt-pocock-skills-tutorial/issues/06-add-workflow-usage-insights.md`

建议 ticket 内容：把本研究笔记中最高价值的 workflow 心法合并进 README、01、02，并新增一个进阶小节；验收标准包括 README 入口、ticket review checklist、feedback loops 小节、QA lifecycle 小节、source links。

## Claims Table

| 教程中想表达的观点 | 是否有来源支持 | 来源 | 建议写法 |
|---|---|---|---|
| Spec/PRD 是 AI 与开发者共频后的共识契约 | 直接支持 shared understanding；“共识契约”是教程转述 | [grill-with-docs](https://www.aihero.dev/skills-grill-with-docs), [to-spec](https://www.aihero.dev/skills-to-spec) | “可以把 spec 看作 shared understanding 的工程契约，而不是聊天摘要。” |
| `/to-spec` 不应重新访谈 | 直接支持 | [to-spec](https://www.aihero.dev/skills-to-spec) | “到 `/to-spec` 时，alignment work 应已完成。” |
| spec 后重点转向 review tickets 是否可执行 | 间接支持，用户推导 | [to-tickets](https://www.aihero.dev/skills-to-tickets), [5 Agent Skills](https://www.aihero.dev/5-agent-skills-i-use-every-day) | “在 spec 稳定后，review 重心应转向 tickets 是否能执行、验证和并行。” |
| Ticket 应是 vertical slice，不是 horizontal layer | 直接支持 | [to-tickets](https://www.aihero.dev/skills-to-tickets), [Tracer Bullets](https://www.aihero.dev/tracer-bullets) | “每张 ticket 都应切穿核心链路，而不是只做一层。” |
| Ticket 应保持 tracer bullet 属性 | 直接支持 | [to-tickets](https://www.aihero.dev/skills-to-tickets), [Tracer Bullets](https://www.aihero.dev/tracer-bullets) | “先打一颗 tracer bullet 验证端到端路径，再扩展。” |
| Ticket 应声明 blocking edges | 直接支持 | [to-tickets](https://www.aihero.dev/skills-to-tickets), [v1.1 changelog](https://www.aihero.dev/skills/skills-changelog-v1-1-wayfinder-to-spec-to-tickets-grilling-improvements) | “没有 blockers 的 ticket 才进入 frontier。” |
| 每个 ticket 应能 fresh context 完成 | 直接支持 | [to-tickets](https://www.aihero.dev/skills-to-tickets) | “一个 fresh context 只做 frontier 上的一张 ticket。” |
| Ticket 太大时会伤害 smart zone | 直接支持 | [Ticket dictionary](https://www.aihero.dev/ai-coding-dictionary/ticket), [Smart Zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone) | “如果 ticket 经常把上下文推入 dumb zone，就应拆小。” |
| Feedback 分底层/架构层/业务层 | 分层是用户推导；各层证据充分 | [tdd](https://www.aihero.dev/skills-tdd), [codebase-design](https://www.aihero.dev/skills-codebase-design), [code-review](https://www.aihero.dev/skills-code-review) | “教程可用三层 feedback 解释为什么每一步都要可验证。” |
| `/implement` 是外层执行 skill | 直接支持 | [implement](https://www.aihero.dev/skills-implement) | “它是 hands, not head：执行 settled plan。” |
| `/tdd` 是 `/implement` 内部方法 | 直接支持 | [tdd](https://www.aihero.dev/skills-tdd), [implement](https://www.aihero.dev/skills-implement) | “TDD 是 implement 内部的 red-green engine。” |
| `/code-review` 是 Standards + Spec 两轴 review | 直接支持 | [code-review](https://www.aihero.dev/skills-code-review) | “不要合并两个 verdict；一个看标准，一个看需求。” |
| QA 失败应打回当前 ticket | 间接支持，用户推导 | [code-review](https://www.aihero.dev/skills-code-review), [Real-world feature build](https://www.aihero.dev/real-world-feature-build-with-claude-code) | “若失败属于当前验收标准，把失败证据写回 ticket 并继续修复。” |
| 独立 bug/优化/新需求应新建 ticket | 间接支持，用户推导 | [to-tickets](https://www.aihero.dev/skills-to-tickets), [code-review](https://www.aihero.dev/skills-code-review) | “不要把 scope creep 混进当前 ticket。” |
| Triage 处理 raw issues，不处理 `/to-tickets` 已生成的 agent-ready tickets | 直接支持 | [triage](https://www.aihero.dev/skills-triage), [to-tickets](https://www.aihero.dev/skills-to-tickets) | “triage 是入口质量控制，to-tickets 是 spec 拆解。” |
| `/wayfinder` 不是普通任务拆分，而是大而模糊工作的 decision map | 直接支持 | [wayfinder](https://www.aihero.dev/skills-wayfinder), [v1.1 changelog](https://www.aihero.dev/skills/skills-changelog-v1-1-wayfinder-to-spec-to-tickets-grilling-improvements) | “Wayfinder 产出 decisions，不产出 deliverables。” |
| `/research` 结果应回到 thinking/planning，而不是直接实现 | 直接支持上游定位；具体回到哪一步需判断 | [research](https://www.aihero.dev/skills-research) | “研究笔记是后续 grill/spec/design 的输入。” |
| `CONTEXT.md` 能减少误解和啰嗦 | 直接支持 | [README](https://github.com/mattpocock/skills), [domain-modeling](https://www.aihero.dev/skills-domain-modeling) | “共享语言让 agent 少用 20 个词解释 1 个术语。” |
| ADR 应稀有，只记录高门槛决策 | 直接支持 | [domain-modeling](https://www.aihero.dev/skills-domain-modeling), [grill-with-docs](https://www.aihero.dev/skills-grill-with-docs) | “ADR 不是设计日记。” |
| `/improve-codebase-architecture` 是日常维护 | 直接支持 | [improve-codebase-architecture](https://www.aihero.dev/skills-improve-codebase-architecture), [5 Agent Skills](https://www.aihero.dev/5-agent-skills-i-use-every-day) | “每几天或一波开发后跑一次，而不是等烂掉。” |
| Skills 强调 small/composable/adaptable | 直接支持 | [README](https://github.com/mattpocock/skills) | “Skills 保留人的控制权，不追求全自动接管。” |
| not vibe coding | 直接支持 | [README](https://github.com/mattpocock/skills), [AI Hero home](https://www.aihero.dev/) | “这套流程是 real engineering，不是放手让 AI 猜。” |
| `/qa` 是当前稳定主线 skill | 来源不足 | [skills.sh](https://www.skills.sh/mattpocock/skills), [AI Hero Skills](https://www.aihero.dev/skills) | “讲 QA loops 和 ticket 验收，不要把 `/qa` 当已确认主线。” |

## Add-to-Tutorial Backlog

| 增强项 | 放在哪里 | 优先级 | 为什么值得加 |
|---|---|---|---|
| 增加“Spec 是共识契约”解释 | 第 2 篇 `/to-spec` 后 | P0 | 能帮读者理解为什么 spec 来自充分追问，而不是文档仪式 |
| 增加 ticket review checklist | 第 2 篇 `/to-tickets` 后 | P0 | 直接提升教程实用性，回答用户重点问题 |
| 增加三层 feedback loops 模型 | 第 2 篇 `/implement` 到 `/code-review` 之间 | P0 | 把 TDD、架构、业务验收统一成一个心智模型 |
| 增加 `/implement`/`/tdd`/`/code-review` 关系图 | 第 2 篇 `/implement` 小节 | P0 | 防止读者把三个 skill 当并列命令 |
| 增加 QA/ticket 生命周期 | 第 2 篇 code-review 后或新进阶小节 | P0 | 补上验收失败、issue comment、新 ticket 的闭环 |
| 增加 smart zone/context hygiene 小节 | 进阶心得小节 | P1 | 解释为什么不要一个上下文撑到底 |
| 增加 grill -> prototype -> grill 模式 | 第 1 篇 `/grill-me` 或进阶心得 | P1 | 防止读者硬答高保真 UI/状态问题 |
| 增加 Wayfinder 边界说明 | 第 2 篇 `/wayfinder` | P1 | 防止把 Wayfinder 当普通任务拆分 |
| 增加 `CONTEXT.md`/ADR 反模式 | 第 2 篇 `/domain-modeling` | P1 | 避免 glossary 膨胀成百科或 scratchpad |
| 增加 wide-refactor exception | 第 2 篇 `/to-tickets` | P2 | 对真实代码库迁移很实用，但不必放入入门主线 |
| 增加安装方式对比：skills.sh vs plugin | README 或第 1 篇 | P2 | 帮读者理解可编辑本地 skill 与 managed bundle 的差别 |
| 新增 ticket 06 | `.scratch/.../issues/06-add-workflow-usage-insights.md` | P0 | 让研究结果进入当前教程工作流，而不是停留在研究笔记 |

## Open Questions

- Matt 是否有原话把 spec/PRD 称为 “contract” 或“共识契约”？本次没有找到；建议标注为教程作者的比喻。
- “spec 后不应主要反复 review spec，而应 review tickets”没有直接出处；建议写成实践建议，而不是 Matt 的明确观点。
- QA 失败“打回 ticket”的状态机没有找到 Matt 的正式定义；可由 code-review/QA loops 推导，但应标注为当前教程 workflow 约定。
- “独立 bug/优化/新需求必须新建 ticket”没有直接出处；建议作为团队 hygiene 写法，并说明它防止 scope creep。
- issue comment 的具体格式没有统一 primary source，除 triage disclaimer、wayfinder resolution comment、handoff references 外，其余属于教程可自定规范。
- “research 结果必须回到 `/grill-with-docs`”不宜写死。更准确是：research note 回到 thinking/planning/design 流程；如果它改变了需求和领域语言，再回 `/grill-with-docs` 或 `/to-spec`。
- “smart zone”在 9 Things 文章中作为经验表达出现，但具体 token 阈值可能随模型变化；教程应表达原则，不固定数字。
- skills.sh 的安装量只能证明公开安装/发现热度，不能证明某个 skill 的质量、完成率或推荐优先级。
