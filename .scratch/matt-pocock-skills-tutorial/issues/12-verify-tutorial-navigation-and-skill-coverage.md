# 12 — 验证链接、锚点与 Skill 覆盖完整性

**What to build:** Verify the revised Matt Pocock Skills tutorial navigation, links, anchors, and local Skill coverage after the README and tutorial article updates land.

**Blocked by:** 08 — 重构 README 为导航页; 09 — 补齐 22 个本地有效 Skill 的教程场景; 10 — 为 README 添加全量 Skill 速查索引; 11 — 补充阅读与离线发布方式说明.

**Status:** resolved

- [x] README relative links point to existing Markdown files.
- [x] README section links point to anchors that exist in the target tutorial files.
- [x] Every local effective Skill listed in the spec appears in the README quick index.
- [x] Every README quick index entry links to a contextual tutorial section.
- [x] Every local effective Skill has at least one scenario in the tutorial series.
- [x] README no longer contains a standalone copyable-template section.
- [x] README scenario routing is grouped into the agreed four categories.
- [x] README uses "建议下一步" or equivalent wording for the action column.
- [x] `/research`, `/prototype`, and `/wayfinder`回流 guidance is separated and unambiguous.
- [x] No scenario says `/wayfinder` normally returns to `/grill-with-docs`.
- [x] No obsolete or historical skills.sh-only names are introduced as primary Skill entries.
- [x] Markdown source-of-truth and HTML release-artifact guidance is present.
- [x] The tutorial remains readable as a scenario-driven guide, not merely an index.

## Comments

- 2026-07-22: Verified README navigation and coverage after tickets 08-11.
  - Ran an automated Markdown check for README relative Markdown links, cross-file section anchors, the 22-Skill quick index, and matching scenarios in `03-local-skill-scenarios.md`.
  - Confirmed the README routing tables use the four agreed groups and the action column wording `建议下一步`.
  - Confirmed `/research`, `/prototype`, and `/wayfinder` feedback guidance is separated, and `/wayfinder` is routed back to `/to-spec`, `/to-tickets`, or `/domain-modeling` rather than normally to `/grill-with-docs`.
  - Confirmed README does not contain a standalone `可复制调用模板` section and does not promote historical `skills.sh`-only names as primary Skill entries.
  - Confirmed Markdown is described as the source of truth and generated HTML as a release artifact.
