# Local HTML Export

Markdown files in `docs/tutorials/matt-pocock-skills/` are the source of truth for this tutorial. Generated HTML is a local reading artifact only. Do not hand-edit the files under `dist/matt-pocock-skills-html/`, and do not commit them.

Run this command when you need an offline browser-openable copy:

```powershell
npm run export:tutorial-html
```

The command writes static files to `dist/matt-pocock-skills-html/`. Open `dist/matt-pocock-skills-html/index.html` directly from the filesystem; no local server is required.

To enable the local post-commit reminder, run:

```powershell
npm run install:tutorial-html-reminder
```

After that, commits that change Markdown files in `docs/tutorials/matt-pocock-skills/` print a reminder to rerun the export command. The hook only reminds; it does not run the export command automatically.

The install command sets `core.hooksPath` and attempts to mark `.githooks/post-commit` executable for POSIX-style environments. If your filesystem does not support that permission bit and the reminder does not run, run:

```powershell
chmod +x .githooks/post-commit
```
