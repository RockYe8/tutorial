# Tutorial

## Codex CLI 入门教程

- [教程首页](docs/tutorials/codex-cli/README.md)
- [1. 安装 Codex CLI](docs/tutorials/codex-cli/01-install-and-verify.md)
- [2. 登录与认证：选择 ChatGPT 账号或 API Key](docs/tutorials/codex-cli/02-authentication-and-configuration.md)
- [3. 第一次进入项目：让 Codex 安全地开始工作](docs/tutorials/codex-cli/03-first-project-workflow.md)
- 本地 HTML 导出：`npm run export:codex-cli-html`

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

## Agent Skill Engineering Handbook

- [手册首页](docs/tutorials/agent-skill-engineering-handbook/README.md)
- [1. 重新理解 Skill](docs/tutorials/agent-skill-engineering-handbook/01-understanding-skill.md)
- [2. Activation 先于 Instructions](docs/tutorials/agent-skill-engineering-handbook/02-activation-before-instructions.md)
- [3. 写好 Skill Body](docs/tutorials/agent-skill-engineering-handbook/03-writing-the-skill-body.md)
- [4. 设计 Supporting Resources](docs/tutorials/agent-skill-engineering-handbook/04-designing-supporting-resources.md)
- [5. 从 Scripts 到 Tools](docs/tutorials/agent-skill-engineering-handbook/05-from-scripts-to-tools.md)
- [6. 先评估，再信任](docs/tutorials/agent-skill-engineering-handbook/06-evaluation-before-trust.md)
- [7. 安全与治理](docs/tutorials/agent-skill-engineering-handbook/07-security-and-governance.md)
- [8. 生命周期与维护](docs/tutorials/agent-skill-engineering-handbook/08-lifecycle-and-maintenance.md)
- [9. 从零构建一个 Pro-Level Skill](docs/tutorials/agent-skill-engineering-handbook/09-building-a-pro-level-skill.md)
- [附录 A：SKILL.md 模板与填写指南](docs/tutorials/agent-skill-engineering-handbook/appendix-a-skill-md-template.md)
- [附录 B：Skill 目录结构与 Bundle 形态决策指南](docs/tutorials/agent-skill-engineering-handbook/appendix-b-directory-patterns.md)
- [附录 C：Activation 与 Description 测试夹具](docs/tutorials/agent-skill-engineering-handbook/appendix-c-activation-description-fixtures.md)
- [附录 D：Evaluation 与 Forward Testing Checklist](docs/tutorials/agent-skill-engineering-handbook/appendix-d-evaluation-forward-testing-checklist.md)
- [附录 E：Security / Release Checklist](docs/tutorials/agent-skill-engineering-handbook/appendix-e-security-release-checklist.md)
- [v1.0 Readiness Checklist](docs/tutorials/agent-skill-engineering-handbook/v1.0-readiness-checklist.md)

## Python 设计意图树教程

- [教程首页](docs/tutorials/python-design-intent-tree/README.md)
- [1. Python 为什么把代码运行成对象、名字和模块？](docs/tutorials/python-design-intent-tree/01-running-model-code-blocks-namespaces.md)

## 维护命令

- `npm test`
- `npm run export:all-tutorials-html`
- `npm run export:tutorial-html`
- `npm run export:codex-cli-html`
- `npm run export:claude-code-html`
- `npm run export:claude-code-basic-manual-html`
- `npm run install:tutorial-html-reminder`

## 发布规则

- GitHub Pages：push 到 `master` 后自动生成所有教程 HTML，并部署 `dist/tutorials-html`。
- GitHub Release：push `v*.*.*` tag 后自动生成 `tutorials-html.zip` 并上传到 Release。
- 新增教程：在 `docs/tutorials/<tutorial-slug>/` 下放置 `README.md` 和 `01-*.md`、`02-*.md` 等编号章节；根 `README.md` 中的出现顺序决定发布首页排序。
- 非发布写作材料：`research-*.md`、`writing-decisions.md`、`draft-*.md`、`local-*.md` 不进入 HTML 发布，也不提交到仓库。
