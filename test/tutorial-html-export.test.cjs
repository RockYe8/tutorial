const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { pathToFileURL } = require("node:url");

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
    "[Intro](01-codex-skills-basics.md#before-you-start) and [README](README.md) and [external](https://example.com/a.md) and [other tutorial](../claude-code-cli/README.md)";

  assert.equal(
    rewriteMarkdownLinks(markdown),
    "[Intro](01-codex-skills-basics.html#before-you-start) and [README](index.html) and [external](https://example.com/a.md) and [other tutorial](../claude-code-cli/README.md)",
  );
});

test("exports tutorial Markdown as filesystem-openable HTML pages", async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "tutorial-html-export-"));
  const sourceDir = path.join(tmp, "source");
  const outputDir = path.join(tmp, "dist");
  fs.mkdirSync(sourceDir, { recursive: true });

  fs.writeFileSync(
    path.join(sourceDir, "README.md"),
    "# Tutorial Home\n\nGo to [Basics](01-basics.md#start).\n\n| Item | Next |\n| --- | --- |\n| One | Two |\n",
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
  assert.match(index, /<tr><th>Item<\/th><th>Next<\/th><\/tr>/);
  assert.doesNotMatch(index, /\| --- \| --- \|/);
  assert.match(basics, /href="index\.html"/);
  assert.doesNotMatch(index, /href="01-basics\.md/);
});

test("claude code basic manual has a documented offline HTML export", async () => {
  const repoRoot = path.resolve(__dirname, "..");
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"),
  );
  const exportCommand = packageJson.scripts["export:claude-code-basic-manual-html"];

  assert.ok(exportCommand);
  assert.match(
    exportCommand,
    /--source-dir "docs\/tutorials\/claude-code-basic-manual"/,
  );
  assert.match(
    exportCommand,
    /--output-dir "dist\/claude-code-basic-manual-html"/,
  );
  assert.match(exportCommand, /--manual-pages-only/);

  const readme = fs.readFileSync(
    path.join(
      repoRoot,
      "docs",
      "tutorials",
      "claude-code-basic-manual",
      "README.md",
    ),
    "utf8",
  );

  assert.match(readme, /npm run export:claude-code-basic-manual-html/);
  assert.match(readme, /Markdown 是本教程唯一手工维护的 source of truth/);
  assert.match(readme, /HTML .*生成物/);
  assert.match(readme, /不应手工编辑/);
  assert.match(readme, /README 和编号章节/);

  const outputDir = path.join(
    fs.mkdtempSync(path.join(os.tmpdir(), "claude-code-basic-manual-html-")),
    "dist",
  );

  await exportTutorialHtml({
    sourceDir: path.join(repoRoot, "docs", "tutorials", "claude-code-basic-manual"),
    outputDir,
    manualPagesOnly: true,
  });

  const expectedFiles = [
    "index.html",
    "01-what-is-claude-code.html",
    "02-install-and-first-run.html",
    "03-read-a-real-project.html",
    "04-make-your-first-change.html",
    "05-debug-test-and-verify.html",
    "06-context-memory-and-claude-md.html",
    "07-planning-and-task-splitting.html",
    "08-skills-and-repeatable-workflows.html",
    "09-advanced-tooling-mcp-subagents-hooks.html",
    "10-team-workflow-ci-and-review.html",
    "11-anti-patterns-and-checklists.html",
  ];

  for (const fileName of expectedFiles) {
    assert.ok(fs.existsSync(path.join(outputDir, fileName)), fileName);
  }

  assert.equal(fs.existsSync(path.join(outputDir, "writing-decisions.html")), false);

  const indexPath = path.join(outputDir, "index.html");
  const indexFileUrl = pathToFileURL(indexPath);
  const index = fs.readFileSync(indexFileUrl, "utf8");

  assert.equal(indexFileUrl.protocol, "file:");
  assert.match(index, /href="01-what-is-claude-code\.html"/);
  assert.doesNotMatch(index, /href="01-what-is-claude-code\.md/);

  const firstRun = fs.readFileSync(
    path.join(outputDir, "02-install-and-first-run.html"),
    "utf8",
  );
  assert.match(firstRun, /href="\.\.\/claude-code-cli\/README\.md"/);
  assert.doesNotMatch(firstRun, /href="\.\.\/claude-code-cli\/README\.html"/);
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
      "docs/tutorials/claude-code-cli/README.md",
    ]),
    true,
  );
  assert.equal(
    shouldRemindForChangedFiles([
      "docs/tutorials/README.md",
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
