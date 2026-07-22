# 11 — 补充阅读与离线发布方式说明

**What to build:** Add concise guidance explaining how to read and distribute the tutorial online, locally, and offline without making generated HTML a second editable source.

**Blocked by:** None — can start immediately.

**Status:** resolved

- [x] README recommends GitHub or repository web UI when online access is available.
- [x] README acknowledges that GitHub may be unreliable for some readers and is not the only reading path.
- [x] README recommends an offline static HTML package as the preferred release/distribution format when network access is unreliable.
- [x] README describes PDF as suitable for archive or sequential reading, but not the preferred navigation format.
- [x] README recommends VS Code or Cursor for local Markdown authoring.
- [x] README notes that local Markdown preview may open cross-file links without scrolling to the exact anchor.
- [x] README states or clearly implies Markdown is the source of truth.
- [x] README states or clearly implies generated HTML is a release artifact and should not be hand-edited.
- [x] README treats GitHub and Gitee as optional distribution channels, not build prerequisites.
- [x] This ticket does not implement the actual static HTML build system.

## Comments

- Implemented in `docs/tutorials/matt-pocock-skills/README.md` by adding a concise “阅读与发布方式” section after the scenario routing tables and before “推荐读法”.
- Verification: checked that the README contains the required online, local Markdown authoring, offline HTML release, PDF, source-of-truth, generated-artifact, and cross-file anchor guidance; confirmed no static HTML build system files were added.
