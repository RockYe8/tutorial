# 11 - 反模式、模板与检查清单

前面十章已经走完了一条完整路径：理解 Claude Code、进入真实项目、读代码、改代码、调试验证、管理上下文、规划拆票、沉淀 skills，再扩展到团队、CI 和 review。

这一章不再展开新主线。它是一张任务工作台：开始前用它收束输入，执行中用它防止跑偏，交付前用它检查证据，交接时用它留下下一位 agent 或同事能接住的上下文。

可以先记住这条总原则：

```text
Claude Code 会放大你的工作流。
输入清楚、边界清楚、验证清楚，它会变快；
目标模糊、权限过大、没有验收，它也会把混乱变快。
```

## 新手最常见的误区

这些误区并不是“不能这么问”，而是它们在真实仓库里很容易把 Claude Code 推向猜测、范围漂移或无证据交付。

| 误区 | 表现 | 更好的做法 |
| --- | --- | --- |
| 把 Claude 当问答机器人 | 只问“这个项目是什么”，但不让它读文件、追流程、形成产物。 | 让它读取相关文件，输出架构摘要、相关文件列表、数据流或待确认问题。 |
| 无复现调试 | 只说“坏了”，不给错误、步骤、失败命令和期望结果。 | 先提供现象、期望、实际、复现步骤、错误信息，让它建立红色反馈。 |
| 无验证交付 | 改完只看回答顺眼，没跑测试、没看 diff、没说明未验证范围。 | 要求 verification summary：改了什么、跑了什么、结果如何、没验证什么。 |
| 巨大 `CLAUDE.md` | 把临时计划、长 prompt、旧日志、百科说明全塞进项目记忆。 | 只保留稳定规则；路径细节放 rules；流程放 skill；临时状态放 ticket 或 handoff。 |
| 高风险不 planning | 登录、权限、账单、数据迁移等任务直接开改。 | 先调查相关文件，列出方案、风险、验证和失败处理，再确认执行。 |
| 过度授权 MCP | 外部 issue、文档、数据库、设计稿都给宽权限读写。 | 先只读、窄 scope、明确信任边界；回写或写操作单独授权。 |
| 滥用 bypass permissions | 为了省确认，把绕过权限当默认模式。 | 只在隔离容器或 VM 等受控环境中使用；日常任务用 permissions 和 hooks 收边界。 |
| subagent 委派不自包含 | 只说“分析一下”，没有目标、输入、范围、输出格式和限制。 | 委派提示写清目标、材料、非目标、输出格式、验证或引用要求。 |

如果你发现 Claude 开始“很努力但不稳”，先不要急着换模型或加长 prompt。多数情况下，先补齐任务输入、缩小范围、恢复验证闭环，会更有效。

## 开始前检查清单

在真实仓库里开一个任务前，先用这张清单判断是否可以直接执行。

- 当前目标能否用一两句话说清楚。
- 已说明本次要交付的用户可见结果、文档结果或系统行为。
- 已给出输入材料：ticket、spec、错误日志、截图、相关文件或设计说明。
- 已写明非目标：哪些相邻需求、重构、优化不属于本次。
- 已说明允许修改的主要路径，或要求 Claude 先定位后再列出计划。
- 已知道最小验证方式：测试、lint、typecheck、链接检查、手工步骤或 review。
- 如果发现新问题，约定记录为 follow-up，而不是顺手混入当前任务。

一个可直接使用的起始提示：

```text
请只处理当前任务。

目标：
- ...

输入材料：
- ticket/spec/错误日志/相关文件：...

范围：
- 可以修改：...
- 不要修改：...

完成标准：
- ...

验证：
- 优先运行或检查：...
- 如果需要扩大验证范围，先说明原因。
```

## Planning 前检查清单

不是每个小任务都需要 planning。但只要任务不确定、高风险、跨模块或影响公共接口，就先规划。

- 任务是否涉及权限、账单、数据迁移、删除、生产配置或部署。
- 是否会改变公共 API、数据模型、模块边界或依赖方向。
- 是否需要跨多个包、服务、页面或团队资产协同修改。
- 是否存在多种实现方案，需要先比较取舍。
- 是否需要先设计测试策略、回滚策略或失败处理。
- 是否还缺关键事实，需要 Claude 先读文件或运行只读命令调查。

一个 plan 请求模板：

```text
请先规划，不要修改文件。

请输出：
- 你需要读取或已读取的相关文件。
- 推荐方案和备选方案的取舍。
- 计划修改的文件，以及每个文件的改动意图。
- 主要风险，尤其是数据、权限、兼容性和测试缺口。
- 最小验证方案，以及什么情况下需要扩大验证。
- 如果实现中发现范围超过当前任务，应停在哪里向我确认。
```

## 改代码前检查清单

真正开始编辑前，先确认 Claude 没有在猜。

- 它是否已经说明相关文件为什么相关。
- 它是否知道本次只改哪些行为或文档范围。
- 它是否列出计划修改的文件，而不是泛泛说“我会检查代码”。
- 对 bugfix，是否已经有复现步骤、失败命令或最小失败测试。
- 对功能改动，是否已经有验收标准或可观察结果。
- 对文档改动，是否知道输出路径、标题、导航链接和相邻章节语气。
- 对共享模块，是否说明了影响面和验证命令。

如果计划看起来过大，可以这样收束：

```text
这个计划超出当前任务。
请重新收束到当前验收标准：
- 不做无关重构。
- 不修改未列入范围的模块。
- 只保留能直接证明当前目标的验证。
```

## 验证前检查清单

验证不是“跑一下看看”，而是证明当前改动满足当前任务。

- 是否先运行最小相关验证，而不是直接跳到无关大命令。
- 是否重新运行了最初失败的测试、命令或复现步骤。
- 是否根据改动范围判断需要 lint、typecheck、构建或全量测试。
- 是否查看 diff，确认没有无关格式化、重命名、依赖升级或重构。
- 验证失败时，是否先分类：属于当前任务、历史问题、环境问题还是新需求。
- 是否记录未验证范围，而不是写“全部正常”。

Verification summary 模板：

```text
Verification summary

修改范围：
- ...

运行过的验证：
- ...：通过 / 失败；关键结果是 ...

失败与处理：
- 如果有失败，说明是否属于当前任务、如何处理、是否重跑通过。

未验证内容：
- 没有运行 ...，原因是 ...
- 需要人工确认的是 ...

后续问题：
- 发现但不属于本次范围的问题：...
```

## Review 前检查清单

Review 的目标不是挑语病，而是确认 diff 是否正确、可维护、可验证、符合原始任务。

- Diff 是否只覆盖当前 ticket 或当前请求。
- 每个主要改动是否能追溯到目标、验收标准或修复证据。
- 是否有无关格式化、批量重命名、依赖变化或顺手重构。
- 测试是否钉住行为，而不是只复制实现细节。
- 是否降低了断言、吞掉错误或用宽类型掩盖问题。
- 是否遗漏边界条件、安全影响、权限影响或数据兼容性。
- 最终说明是否包含验证证据和未验证范围。

Claude review 请求模板：

```text
请 review 当前 diff。

输入：
- 当前任务或 ticket 验收标准。
- 项目 review criteria。
- 已运行的验证输出。

请输出：
- 按严重程度列出 findings。
- 每条 finding 说明证据、影响和建议处理方式。
- 区分阻塞问题、非阻塞风险和测试缺口。
- 如果没有发现问题，也请说明仍有哪些未验证范围。

限制：
- 不修改文件。
- 不替代人工 review 或合并判断。
```

## Handoff 前检查清单

当会话变长、任务要交给下一位 agent、准备收工或需要进入 fresh context 时，生成 handoff。

- 当前目标是否一句话说清。
- 已读材料是否列出路径，而不是复述全部内容。
- 已完成工作是否对应具体文件或具体行为。
- 当前 diff 状态是否清楚：已改、未改、待确认。
- 已运行验证和结果是否明确。
- 未验证范围和失败原因是否诚实记录。
- 下一步是否具体到“读什么、改什么、跑什么”。
- 新需求、独立 bug 或优化是否列为 follow-up，而不是混进当前任务。

Handoff 模板：

```text
Handoff

当前目标：
- ...

已读材料：
- ...

已完成：
- ...

当前状态：
- ...

验证证据：
- ...

未验证 / 风险：
- ...

下一步：
- ...

Follow-up：
- ...
```

## 可改写模板

下面这些模板不是固定咒语。使用时先删掉无关项，再补真实项目事实。

### `CLAUDE.md` 条目模板

```markdown
## Project Rules

- 本项目主要交付 ...
- 常用验证命令：
  - `...`：...
  - `...`：...
- 修改共享模块前，先说明影响范围和验证计划。
- 文档变更后，检查相邻导航或 README 链接。
- 发现当前任务外的问题，记录为 follow-up，不扩大当前 diff。
```

### Debug 输入模板

```text
我遇到一个 bug。

期望：
- ...

实际：
- ...

复现步骤：
1. ...
2. ...

失败命令或检查：
- ...

关键错误：
- ...

最近变化：
- ...

请先建立红色反馈或确认复现路径。
在复现前不要猜测修复。
```

### Skill skeleton

```markdown
---
name: ...
description: Use when ...
---

## When to use

Use this when ...
Do not use this when ...

## Inputs

- ...

## Process

1. ...
2. ...
3. ...

## Output

- ...

## Verification

- ...

## Failure handling

- If input is missing, report what is missing instead of guessing.
- If scope grows, stop and ask whether to split a new task.
```

### CI prompt 模板

```text
目标：
- ...

输入：
- 当前 diff / ticket / spec / 测试输出 / 项目规则：...

成功标准：
- ...

输出位置：
- PR comment / artifact / patch / report：...

允许范围：
- 可以读：...
- 可以改：...
- 可以运行：...

不允许：
- 修改 secrets、部署、直接推主干、扩大到无关模块。

失败处理：
- 如果测试失败、权限不足、冲突或上下文不足，请报告原因、证据和建议下一步。
```

### Subagent 委派模板

```text
请作为 subagent 完成一个隔离调查任务。

目标：
- ...

输入材料：
- ...

范围：
- 只读取 / 只分析 ...
- 不修改文件。

输出格式：
- 结论摘要。
- 关键证据和文件路径。
- 不确定点。
- 建议主会话下一步。

限制：
- 不要依赖主会话未写明的背景。
- 不要展开无关目录。
```

## Advanced checklist：ticket、handoff、smart zone 和 QA 生命周期

这部分适合已经在使用 spec、tickets、skills 或多会话协作的团队。它不是基础前置，但能减少成熟工作流里最常见的混乱。

### Ticket review

- 这张 ticket 是否是 vertical slice，而不是 schema/API/UI/test 横向切层。
- 是否像 tracer bullet：先打通一条小的端到端反馈路径。
- 是否写清 blocking edges：依赖谁、解锁谁、哪些能并行。
- 是否能在 fresh context 中完成：ticket、spec 和必要材料足够自包含。
- 是否有独立验收标准：完成后可以单独测试、demo、review 或 QA。
- 如果 ticket 同时包含多个反馈路径，是否应拆小。

### Smart zone

- 会话是否已经太长，Claude 开始漏掉前面约束。
- 当前 ticket 是否像小 spec，验收项越来越多。
- 是否反复重读背景仍然方向不稳。
- 是否出现大量“顺便也做”的相邻需求。
- 如果上下文变浑，优先 handoff、compact、拆 ticket 或回到 planning。

### Handoff

- Handoff 引用 spec、ticket、diff、验证输出，不复制整段聊天。
- 它说明当前目标、完成状态、修改文件、验证证据和下一步。
- 它把未完成工作写成可执行步骤，而不是“继续完善”。
- 它把 follow-up 和当前验收失败分开。

### QA 生命周期

- 如果 QA 失败属于当前 ticket 验收标准，打回当前 ticket，附失败证据并继续修复。
- 如果 QA 发现相关但独立的新需求，新建 ticket。
- 如果 QA 发现独立 bug 或优化，新建 ticket，并说明来源和优先级。
- 如果失败来自 spec 不清，回到 spec 或 planning，不让 agent 猜。
- 当前 ticket 关闭前，应有修改范围、验证结果、未验证范围和残余风险。

## 本章校验

读完本章，你应该能做到：

- 识别把 Claude 当问答机器人、无复现调试、无验证交付、巨大 `CLAUDE.md`、高风险不 planning、过度授权 MCP、滥用 bypass permissions 和 subagent 委派不自包含等反模式。
- 在开始前、planning 前、改代码前、验证前、review 前和 handoff 前使用对应检查清单。
- 改写 `CLAUDE.md` 条目、debug 输入、plan 请求、verification summary、skill skeleton、CI prompt 和 subagent 委派模板。
- 在 advanced workflow 中 review tickets，判断是否需要 handoff 或拆票，并处理 QA 打回、新需求和 follow-up 的边界。

如果你只带走一个动作：每次交付前都要求 Claude 说明“改了什么、验证了什么、没验证什么、发现了哪些不属于当前范围的问题”。这会让大多数会话立刻变稳。

## 参考来源

- Claude Code Common workflows: https://code.claude.com/docs/en/common-workflows
- Claude Code Best practices: https://code.claude.com/docs/en/best-practices
- Claude Code Memory / CLAUDE.md: https://code.claude.com/docs/en/memory
- Claude Code Permissions: https://code.claude.com/docs/en/permissions
- Claude Code MCP: https://code.claude.com/docs/en/mcp
- Claude Code Subagents: https://code.claude.com/docs/en/sub-agents
- Claude Code Hooks: https://code.claude.com/docs/en/hooks-guide
- Matt Pocock engineering workflow tutorial: ../matt-pocock-skills/02-engineering-workflow.md
- Matt Pocock workflow research notes: ../matt-pocock-skills/research-matt-pocock-workflow-usage-insights.md
