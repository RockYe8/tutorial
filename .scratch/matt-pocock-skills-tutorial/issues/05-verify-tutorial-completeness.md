# 05 - 校验教程完整性与链接一致性

**What to build:** Verify and polish the tutorial series so the three Markdown files work as a coherent, shareable learning path with accurate links, complete Skill coverage, and consistent Todo examples.

**Blocked by:** 02 - 写入门篇：从 Todo MVP 理解 Codex Skills; 03 - 写工程化篇主链路：从 Setup 到 Code Review; 04 - 补充特殊场景 Skills 与实践跳转.

**Status:** resolved

- [x] Verify `docs/tutorials/matt-pocock-skills/README.md` exists.
- [x] Verify `docs/tutorials/matt-pocock-skills/01-codex-skills-basics.md` exists.
- [x] Verify `docs/tutorials/matt-pocock-skills/02-engineering-workflow.md` exists.
- [x] Verify README links point to real headings in the article files.
- [x] Verify every installed Matt Pocock Skill is covered at least once either in the main workflow or a supplemental scenario.
- [x] Verify Todo terminology and example progression are consistent across all three files.
- [x] Verify the tutorial distinguishes user-invoked Skills from lower-level supporting disciplines.
- [x] Verify `/setup-matt-pocock-skills` is described as repository convention setup, not Skill installation.
- [x] Verify `/grill-with-docs` is described as clarification plus domain documentation, not automatic full spec generation.
- [x] Verify `/implement` and `/tdd` are described with the correct outer/inner relationship.
- [x] Verify `/triage` is described as processing raw incoming issues, not tickets already produced by `/to-tickets`.
- [x] Polish the prose so the tutorial reads as practical Chinese learning material rather than an outline.

## Comments

### 2026-07-22 - Agent verification

- Completed this verification ticket while preserving the repo's implementation-issue triage label vocabulary in the `Status:` field.
- Verified all three tutorial Markdown files exist.
- Verified README tutorial links point to existing Markdown files and real explicit heading anchors.
- Verified all 22 installed local Matt Pocock Skills under `C:\Users\YHong\.codex\skills` are covered at least once, excluding `.system`.
- Verified the Todo examples progress consistently from a personal Todo MVP to an existing Todo app adding tags, filtering, and archiving.
- Verified `/setup-matt-pocock-skills`, `/grill-with-docs`, `/implement` plus `/tdd`, and `/triage` are described with the intended boundaries.
- Added a short README clarification distinguishing user-invoked outer workflows from lower-level supporting disciplines.

### 2026-07-22 - Final verification

- Re-verified the three tutorial files, README links and anchors, Skill coverage, workflow boundary notes, and Todo example progression; all acceptance checks pass, so this ticket is resolved.
