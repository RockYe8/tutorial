const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const {
  exportTutorialHtml,
  rewriteMarkdownLinks,
} = require("../scripts/export-tutorial-html.cjs");
const {
  shouldRemindForChangedFiles,
} = require("../scripts/tutorial-html-export-reminder.cjs");
const {
  hookExecutableWarning,
} = require("../scripts/install-tutorial-html-reminder.cjs");

test("rewrites tutorial-relative Markdown links to generated HTML links", () => {
  const markdown =
    "[Intro](01-codex-skills-basics.md#before-you-start) and [README](README.md) and [external](https://example.com/a.md)";

  assert.equal(
    rewriteMarkdownLinks(markdown),
    "[Intro](01-codex-skills-basics.html#before-you-start) and [README](index.html) and [external](https://example.com/a.md)",
  );
});

test("exports tutorial Markdown as filesystem-openable HTML pages", async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "tutorial-html-export-"));
  const sourceDir = path.join(tmp, "source");
  const outputDir = path.join(tmp, "dist");
  fs.mkdirSync(sourceDir, { recursive: true });

  fs.writeFileSync(
    path.join(sourceDir, "README.md"),
    "# Tutorial Home\n\nGo to [Basics](01-basics.md#start).\n",
  );
  fs.writeFileSync(
    path.join(sourceDir, "01-basics.md"),
    "# Basics\n\n<a id=\"start\"></a>\n## Start\n\nBack to [home](README.md).\n",
  );

  await exportTutorialHtml({ sourceDir, outputDir });

  const index = fs.readFileSync(path.join(outputDir, "index.html"), "utf8");
  const basics = fs.readFileSync(path.join(outputDir, "01-basics.html"), "utf8");

  assert.match(index, /<!doctype html>/i);
  assert.match(index, /href="01-basics\.html#start"/);
  assert.match(index, /<h1 id="tutorial-home">Tutorial Home<\/h1>/);
  assert.match(basics, /href="index\.html"/);
  assert.doesNotMatch(index, /href="01-basics\.md/);
});

test("post-commit reminder only triggers for tutorial Markdown changes", () => {
  assert.equal(
    shouldRemindForChangedFiles([
      "docs/tutorials/matt-pocock-skills/README.md",
      "scripts/export-tutorial-html.cjs",
    ]),
    true,
  );
  assert.equal(
    shouldRemindForChangedFiles([
      "docs/tutorials/other/README.md",
      "docs/tutorials/matt-pocock-skills/image.png",
    ]),
    false,
  );
});

test("install reminder warning tells maintainers how to fix a non-executable hook", () => {
  assert.match(
    hookExecutableWarning(".githooks/post-commit"),
    /chmod \+x \.githooks\/post-commit/,
  );
});
