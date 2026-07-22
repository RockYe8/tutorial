# 08 — 重构 README 为导航页

**What to build:** Turn the tutorial README into a clean navigation and routing page that sets reader expectations, removes context-free prompt templates, and makes the scenario table easier to scan.

**Blocked by:** None — can start immediately.

**Status:** resolved

- [x] README explicitly says the tutorial is not Matt Pocock official documentation or an official translation.
- [x] README no longer contains a standalone "可复制调用模板" section.
- [x] README directs readers to contextual examples inside tutorial sections instead of encouraging context-free copy/paste.
- [x] The scenario routing action column uses "建议下一步" or equivalent wording, not "优先使用的 Skill".
- [x] The long scenario routing table is split into four groups: 新手入门, 主链路, Shaping 与回流, 维护与异常.
- [x] `/research`, `/prototype`, and `/wayfinder`回流 are not collapsed into one ambiguous row.
- [x] `/wayfinder` is not described as normally returning to `/grill-with-docs`.
- [x] README link text includes clear article and section names so readers can recover when local preview only opens the target file.
- [x] README remains a navigation page, not a full conceptual article.

## Comments

- 2026-07-22: Marked resolved after checking the current `docs/tutorials/matt-pocock-skills/README.md` against the acceptance criteria. The README navigation restructure was merged to `master` in `81720d9` (`Merge README navigation restructure`).
- Verification basis: the README now states this is not official Matt Pocock documentation or an official translation, removes the standalone `可复制调用模板` section, points readers to contextual tutorial sections, uses `建议下一步` as the routing action column, and splits routing into `新手入门`, `主链路`, `Shaping 与回流`, and `维护与异常`.
- Additional verification basis: `/research`, `/prototype`, and `/wayfinder` feedback paths are separated; `/wayfinder` is not described as normally returning to `/grill-with-docs`; README link text includes article and section names; and the README remains a navigation/routing surface rather than a full conceptual article.
