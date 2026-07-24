# 10 - 团队工作流、CI 与 review

前面几章讲的是个人如何把 Claude Code 用进真实开发任务：读项目、管理上下文、规划、修改、验证，再把重复流程沉淀成 skill。

这一章把视角再往外推一步：当 Claude Code 不只服务一个人，而是进入团队、PR/MR 审查和 CI 场景时，真正重要的不是“让它更自动”，而是让它在共享规则、最小权限和人工 review 的边界内工作。

可以先记住一句话：

```text
无人值守可以减少等待，不等于无人审查。
```

CI 里运行 Claude Code、让它根据失败测试修复代码、让它评论 PR，都是可行的团队化方向。但这些流程应该优先产出可 review 的 PR/MR、报告或 comment，而不是绕过工程判断直接推主干、自动合并或悄悄修改生产资源。

## 团队化的第一步是共享资产

一个人使用 Claude Code 时，很多上下文可以留在脑子里：测试怎么跑、哪些目录不能碰、review 时看什么、PR 描述怎么写。团队使用时，这些隐性知识必须变成共享资产，否则每个 agent 会话都要重新解释一遍，每次交接也更容易漏掉约束。

最小团队资产通常包括：

| 资产 | 解决的问题 | 建议位置 |
| --- | --- | --- |
| `CLAUDE.md` | 项目结构、稳定规则、常用验证命令、review 口径。 | 项目根目录或 `.claude/` 下，并纳入版本控制。 |
| Skills / slash commands | 高频任务的可重复流程，例如 review、release check、ticket 实现、PR 描述。 | 项目级 `.claude/skills/` 或团队约定位置。 |
| Spec | 需求共识、目标、非目标、验收标准。 | issue、PRD 系统或仓库内 `.scratch/<effort>/spec.md`。 |
| Tickets | 可由一个 fresh context 完成的执行单元。 | issue tracker 或仓库内 Markdown issues。 |
| Review criteria | 审查时看什么：正确性、测试、边界、性能、安全、文档。 | `CLAUDE.md`、review skill 或团队文档。 |
| 验证命令 | 测试、lint、typecheck、构建、文档链接检查。 | `CLAUDE.md`、CI 配置、ticket 验收标准。 |
| Handoff | 当前状态、已验证内容、失败原因、下一步。 | ticket comment、PR/MR comment 或 handoff 文档。 |

这些资产的价值不是“多写文档”，而是减少重复解释和交接损耗。下一位开发者、下一次 Claude Code 会话、CI 里的非交互任务，都可以从同一组规则和证据进入项目。

一个好的团队规则应该具体到足以执行。例如：

```markdown
## Verification

- 文档章节变更后，检查 README 是否能链接到新章节。
- 前端行为变更至少运行对应组件测试；公共行为变更运行 typecheck。
- 最终总结必须列出运行过的命令、结果、未验证范围。

## Review criteria

- Diff 只包含当前 ticket 范围。
- 变更符合 spec 和 ticket 验收标准。
- 没有把新需求、优化或无关重构混进当前 PR。
```

这比“请保持高质量”“请注意测试”更适合团队协作。Claude Code 需要的是可执行边界，而不是礼貌愿望。

## PR/MR review 是验证闭环的一部分

Claude Code 可以帮助写代码，也可以帮助 review 代码。但 review 不应该只发生在最后一秒，也不应该只靠 Claude。

一个基本的 PR/MR 闭环可以这样组织：

```text
ticket/spec
  -> branch 上实现
  -> 运行最小相关验证
  -> 查看 diff 和范围
  -> Claude review
  -> 人工 review
  -> 修复发现的问题
  -> merge 前再次确认检查结果
```

其中每一步都应该留下证据：

| 环节 | 应留下什么 |
| --- | --- |
| Diff | 修改了哪些文件，是否只覆盖当前范围。 |
| 测试证据 | 运行了哪些命令，结果如何，失败如何处理。 |
| Claude review | 发现的问题、风险、遗漏验收项、建议补测点。 |
| 人工 review | 工程判断、产品取舍、安全/权限确认。 |
| 最终说明 | 已修复内容、未验证内容、残余风险。 |

Claude review 适合承担“第二双眼睛”：检查 diff 是否偏离 spec、是否遗漏测试、是否引入 scope creep、是否违反项目标准。人工 review 则要负责最终判断：需求是不是被正确理解，风险是否可接受，是否允许合并。

不要把 Claude review 写成“通过即可合并”。更稳的写法是：

```text
请 review 当前 PR/MR 的 diff。
输入：spec、ticket 验收标准、项目 review criteria、测试输出。
输出：按严重程度列出 findings；每条说明证据、影响和建议处理方式。
限制：不要修改文件，不要批准合并，不要替代人工 review。
```

这个边界能让 Claude review 成为验证闭环的一部分，而不是一个自动放行按钮。

## CI prompt 必须比聊天 prompt 更具体

人在交互式会话里可以随时补充信息；CI 里的 Claude Code 通常不能。它在容器、runner 或非交互模式中执行时，prompt 必须写清楚成功标准、输出位置、失败处理和允许修改范围。

一个含糊的 CI prompt 可能是：

```text
检查这个 PR，有问题就修。
```

它的问题很多：不知道检查什么、不知道能改哪里、不知道修到什么程度、不知道失败时写在哪里，也不知道是否允许继续迭代。

更好的 CI prompt 应该包含：

| 要素 | 应说明什么 |
| --- | --- |
| 目标 | 审查、生成报告、修复失败测试、补 PR 描述，还是创建新 PR。 |
| 输入 | 当前 diff、目标分支、spec/ticket、测试输出、项目规则。 |
| 成功标准 | 什么算完成，必须满足哪些验收项。 |
| 输出位置 | PR comment、artifact 文件、patch、commit、MR 描述或日志。 |
| 失败处理 | 测试失败、权限不足、上下文不足、超时或冲突时怎么报告。 |
| 允许范围 | 可以读哪些文件、改哪些路径、运行哪些命令、不能碰什么。 |
| 成本边界 | timeout、max turns、并发限制和停止条件。 |

例如，一个只做审查的 CI prompt 可以写成：

```text
请审查当前 PR 相对 main 的 diff。

输入：
- 当前 PR diff。
- docs/CONTRIBUTING.md 中的 review 标准。
- 当前 ticket 或 PR 描述中的验收标准。
- 已有测试输出。

成功标准：
- 按严重程度列出阻塞问题、非阻塞风险和测试缺口。
- 每个 finding 引用具体文件或 diff 证据。
- 如果没有发现问题，明确说明仍有哪些未验证范围。

输出：
- 只写 PR comment。

限制：
- 不修改文件。
- 不触发部署。
- 不批准或合并 PR。
```

如果 CI 任务允许 Claude Code 自动修复，也要把范围进一步收窄：

```text
目标：只修复当前 PR 中由测试失败暴露出的回归。
允许修改范围：当前 PR 已修改的源码和相关测试。
不允许：重写无关模块、升级依赖、修改 secrets、改 CI 配置、直接推主干。
完成后：运行失败测试对应的最小验证，把命令和结果写入 PR comment。
失败时：说明失败命令、最后错误、建议人工处理的下一步。
```

CI prompt 的具体性越高，Claude Code 越不需要猜。团队也更容易 review 它到底做了什么。

## 最小权限、成本和审计边界

团队场景里，权限问题比个人实验更重要。因为 CI、PR bot 或自动化 runner 往往能访问代码、issue、secrets、包仓库和部署环境。Claude Code 进入这些场景时，默认应该按最小权限设计。

基础原则如下：

| 风险点 | 建议边界 |
| --- | --- |
| 写权限 | 审查任务默认只读；自动修复才给编辑权限，且限定路径。 |
| 命令执行 | 只允许必要验证命令；部署、删除、发布、迁移需要人工审批。 |
| Secrets | 使用 CI secrets 管理 API key；不要让 Claude 输出、编辑或复制 secrets。 |
| 外部系统 | issue、PR、文档、监控等先只读；回写 comment 或状态需要明确授权。 |
| Timeout | 给 job 设置超时，避免任务无限迭代。 |
| Max turns | 限制 Claude Code 的回合数或迭代次数，控制成本和 runaway 修复。 |
| 审计 | 记录触发者、输入、输出、修改文件、验证命令和失败原因。 |

特别要避免两个极端。

第一个极端是“为了省确认，把权限全开”。这会让一个模糊 prompt 变成高风险自动化。即使 Claude Code 本身表现很好，外部内容、错误配置或需求歧义也可能导致越权修改。

第二个极端是“CI 只能跑一次神秘检查，结果没人看”。这样虽然安全，但没有形成协作价值。更好的做法是让 CI 产出可追溯的 comment、artifact 或 PR/MR，让人能看到它读了什么、判断了什么、没做什么。

成本控制也要写进流程。CI 任务应避免被每个小 comment、每次 push 或每个失败分支无限触发。可以通过触发条件、concurrency、timeout、max turns 和更具体的任务范围控制消耗。

## 优先产出 PR/MR，不直接推主干

当 Claude Code 在团队自动化中具备写权限时，默认目标应该是产出可 review 的变更，而不是直接改变主干。

常见安全路径是：

```text
发现问题
  -> 创建 branch
  -> 修改最小范围
  -> 运行验证
  -> 创建 PR/MR
  -> 写清验证证据和风险
  -> 等待人工 review 和合并
```

这条路径保留了版本控制、diff、CI 检查、人工审批和回滚机会。它也让团队成员可以讨论“这个修复是不是正确”“是否覆盖 spec”“是否需要新 ticket”，而不是在主干上事后追查自动化做了什么。

直接推主干或自动合并只适合极少数低风险、强约束、可回滚的机械任务，并且仍然需要审计记录。基础团队不应该把它作为默认模式。

## Handoff：让下一位 agent 或同事接得住

团队工作流的另一个关键点是交接。Claude Code 做完一个任务后，不应该只说“已完成”。它应该留下足够证据，让下一位 reviewer、下一次会话或 CI job 能接住。

一个实用 handoff 可以包含：

| 内容 | 示例 |
| --- | --- |
| 完成范围 | “完成 ticket 13 的第 10 章写作，只新增目标章节。” |
| 修改文件 | “新增 `10-team-workflow-ci-and-review.md`，README 已有链接。” |
| 验证证据 | “确认文件存在、标题正确、README 链接可达。” |
| 未验证内容 | “未运行站点构建，因为本 ticket 只要求 Markdown 链接。” |
| 残余风险 | “第 11 章尚未创建，README 链接会在对应 ticket 完成后真正落地。” |
| 后续事项 | “若需要 HTML 包，另开 export ticket。” |

Handoff 不需要复制整份 spec，也不需要把聊天记录重写一遍。它应该引用已有 artifact：spec、ticket、PR、diff、测试输出和 review comment。这样交接信息短，但可追溯。

## Advanced：ticket 生命周期里的 implement、tdd 和 code-review

Matt Pocock workflow 可以作为成熟团队的进阶参考，但不应该变成基础读者的必学主线。这里最值得借鉴的是它把一个 ticket 的生命周期拆成多个反馈层次：

```text
spec + ready-for-agent ticket
  -> /implement
       -> 在适合的行为接缝使用 /tdd
       -> 经常运行 typecheck、单测或最小相关验证
       -> 完成后调用 /code-review
       -> 更新 ticket comment、提交当前 ticket
```

三者不是并列关系。

`/implement` 是外层执行：它读取 settled spec 和 ready-for-agent ticket，控制范围，完成交付，并负责收尾。

`/tdd` 是内部反馈：当任务有清晰行为接缝时，先写失败测试，再实现，再重构。不是所有 ticket 都适合 TDD；纯文档 ticket 的反馈可能是链接、标题、导航和验收清单。

`/code-review` 是收尾检查：用 Standards 和 Spec 两个轴检查 diff。Standards 看是否符合仓库规范和基本工程质量；Spec 看是否忠实实现了原始 ticket 和验收标准。

QA 或 review 发现问题时，先判断它属于哪一类：

| 发现 | 应如何处理 |
| --- | --- |
| 属于当前 ticket 验收标准 | 打回当前 ticket，附失败证据，继续修复。 |
| 属于相关但独立的新需求 | 新建 ticket，不塞进当前范围。 |
| 属于独立 bug 或优化 | 新建 ticket，并标清来源和优先级。 |
| 属于 spec 不清 | 回到 spec 或 planning，而不是让 agent 猜。 |

这套做法的重点不是仪式，而是防止 scope creep。当前 ticket 的失败要在当前 ticket 内修；新的想法要变成新的执行单元。这样每个 PR/MR 都能保持小、清楚、可 review。

## 本章校验

读完本章，你应该能做到：

- 解释为什么无人值守不等于无人审查。
- 列出团队共享资产：`CLAUDE.md`、skills、spec、tickets、review criteria、验证命令和 handoff。
- 说明共享资产如何减少重复解释和交接损耗。
- 设计一个包含 diff、测试证据、Claude review 和人工 review 的 PR/MR 闭环。
- 写出比“检查这个 PR”更具体的 CI prompt，包含成功标准、输出位置、失败处理和允许范围。
- 说明最小权限、timeout、max turns、secrets、人工审批和审计为什么重要。
- 坚持优先产出 PR/MR，而不是直接推主干或无人值守自动合并。
- 正确理解 advanced workflow：`/implement` 是外层执行，`/tdd` 是内部反馈，`/code-review` 是收尾检查。

下一章会把整套教程收束成反模式、模板和检查清单，方便你在真实任务开始前、执行中和交接前快速自查。

## 参考来源

- Claude Code GitHub Actions: https://code.claude.com/docs/en/github-actions
- Claude Code GitLab CI/CD: https://code.claude.com/docs/en/gitlab-ci-cd
- Claude Code CLI reference: https://code.claude.com/docs/en/cli-reference
- Claude Code Permissions: https://code.claude.com/docs/en/permissions
- Claude Code Memory / CLAUDE.md: https://code.claude.com/docs/en/memory
- Claude Code Skills / slash commands: https://code.claude.com/docs/en/slash-commands
- Matt Pocock engineering workflow tutorial: ../matt-pocock-skills/02-engineering-workflow.md
- Matt Pocock workflow research notes: ../matt-pocock-skills/research-matt-pocock-workflow-usage-insights.md
