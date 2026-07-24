# Tutorial

## Claude Code CLI 入门教程

- [教程首页](docs/tutorials/claude-code-cli/README.md)
- [1. 安装 Claude Code](docs/tutorials/claude-code-cli/01-install-and-verify.md)
- [2. 可选：接入 LLM Gateway 或组织提供的模型服务](docs/tutorials/claude-code-cli/02-gateway-configuration.md)
- [3. 第一次在项目中使用 Claude Code](docs/tutorials/claude-code-cli/03-daily-workflow-and-extensions.md)

## Claude Code 基础使用手册与方法论

- [手册首页](docs/tutorials/claude-code-basic-manual/README.md)
- [1. 什么是 Claude Code](docs/tutorials/claude-code-basic-manual/01-what-is-claude-code.md)
- [2. 安装与第一次启动](docs/tutorials/claude-code-basic-manual/02-install-and-first-run.md)
- [3. 让 Claude Code 先读懂真实项目](docs/tutorials/claude-code-basic-manual/03-read-a-real-project.md)
- [4. 完成第一次小范围修改](docs/tutorials/claude-code-basic-manual/04-make-your-first-change.md)
- [5. 调试、测试与验证闭环](docs/tutorials/claude-code-basic-manual/05-debug-test-and-verify.md)
- [6. 上下文、memory 与 CLAUDE.md](docs/tutorials/claude-code-basic-manual/06-context-memory-and-claude-md.md)
- [7. Planning mode 与任务拆分](docs/tutorials/claude-code-basic-manual/07-planning-and-task-splitting.md)
- [8. Skills 与可复用工作流](docs/tutorials/claude-code-basic-manual/08-skills-and-repeatable-workflows.md)
- [9. MCP、subagents、hooks 等进阶工具边界](docs/tutorials/claude-code-basic-manual/09-advanced-tooling-mcp-subagents-hooks.md)
- [10. 团队工作流、CI 与 review](docs/tutorials/claude-code-basic-manual/10-team-workflow-ci-and-review.md)
- [11. 反模式、模板与检查清单](docs/tutorials/claude-code-basic-manual/11-anti-patterns-and-checklists.md)
- 本地 HTML 导出：`npm run export:claude-code-basic-manual-html`

## Matt Pocock Skills 教程

- [教程首页](docs/tutorials/matt-pocock-skills/README.md)
- [1. 从 Todo MVP 理解 Codex Skills](docs/tutorials/matt-pocock-skills/01-codex-skills-basics.md)
- [2. 从 Setup 到 Code Review 的工程主链路](docs/tutorials/matt-pocock-skills/02-engineering-workflow.md)
- [3. 22 个本地 Skill 的场景速写](docs/tutorials/matt-pocock-skills/03-local-skill-scenarios.md)

## 维护命令

- `npm test`
- `npm run export:all-tutorials-html`
- `npm run export:tutorial-html`
- `npm run export:claude-code-html`
- `npm run export:claude-code-basic-manual-html`
- `npm run install:tutorial-html-reminder`

## 发布规则

- GitHub Pages：push 到 `master` 后自动生成所有教程 HTML，并部署 `dist/tutorials-html`。
- GitHub Release：push `v*.*.*` tag 后自动生成 `tutorials-html.zip` 并上传到 Release。
- 新增教程：在 `docs/tutorials/<tutorial-slug>/` 下放置 `README.md` 和 `01-*.md`、`02-*.md` 等编号章节；根 `README.md` 中的出现顺序决定发布首页排序。
- 非发布写作材料：`research-*.md`、`writing-decisions.md`、`draft-*.md`、`local-*.md` 不进入 HTML 发布，也不提交到仓库。
