# 13 - 添加教程本地 HTML 导出 workflow

**What to build:** Add a lightweight local export workflow so the maintainer can generate a browser-openable offline HTML version of the Matt Pocock Skills tutorial from the Markdown source, without making generated HTML a second source of truth.

**Blocked by:** None - can start immediately.

**Status:** resolved

- [x] A lightweight Node-based export command is available as `npm run export:tutorial-html`.
- [x] The export command generates a local HTML folder under `dist/matt-pocock-skills-html/`.
- [x] The generated folder contains an `index.html` entry point derived from the tutorial README.
- [x] The generated tutorial pages can be opened from the filesystem in a browser without starting a local server.
- [x] Tutorial-relative Markdown links are rewritten so generated pages link to `.html` files and preserve anchors where applicable.
- [x] The generated HTML output is excluded from git.
- [x] A local post-commit reminder detects changes to the tutorial Markdown files and reminds the maintainer to run the export command without automatically running it.
- [x] The repository documentation explains that Markdown is the source of truth and generated HTML is a local export artifact, not a hand-edited release source.
- [x] The implementation does not add GitHub Release uploads, GitHub Actions automation, GitHub Pages publishing, a full documentation framework, or PDF generation.

## Comments

- 2026-07-22: Created from the updated Matt Pocock Skills tutorial spec after release workflow grilling. Key decisions: use a lightweight Node export script, keep generated HTML out of git, name the command `npm run export:tutorial-html`, use post-commit reminder only, and defer GitHub Release, Actions, Pages, full docs frameworks, and PDF generation.
- 2026-07-22: Implemented local Node export workflow. Added `npm run export:tutorial-html`, generated local HTML under `dist/matt-pocock-skills-html/`, ignored that generated folder, added `.githooks/post-commit` reminder plus `npm run install:tutorial-html-reminder`, and documented the source-of-truth/export-artifact split in `docs/tutorials/matt-pocock-skills/local-html-export.md`. Verification: `npm test`, `npm run export:tutorial-html`, generated href scan for leftover tutorial `.md` links, and `git config --get core.hooksPath`.
- 2026-07-23: Addressed code review feedback for POSIX hook execution. The hook installer now attempts to mark `.githooks/post-commit` executable and prints a `chmod +x .githooks/post-commit` fallback if permission-bit handling fails. Added test and documentation coverage for this behavior. Verification: `npm test` and `npm run export:tutorial-html`.
