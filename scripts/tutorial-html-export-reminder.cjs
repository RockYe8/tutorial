const { execFileSync } = require("node:child_process");

const TUTORIAL_MARKDOWN = /^docs\/tutorials\/matt-pocock-skills\/[^/]+\.md$/;

function normalizePath(filePath) {
  return filePath.replaceAll("\\", "/");
}

function shouldRemindForChangedFiles(files) {
  return files.map(normalizePath).some((file) => TUTORIAL_MARKDOWN.test(file));
}

function changedFilesForLastCommit() {
  const output = execFileSync(
    "git",
    ["diff-tree", "--no-commit-id", "--name-only", "-r", "HEAD"],
    { encoding: "utf8" },
  );
  return output.split(/\r?\n/).filter(Boolean);
}

function runReminder() {
  const files = changedFilesForLastCommit();
  if (!shouldRemindForChangedFiles(files)) return;

  console.log("");
  console.log("Tutorial Markdown changed in the last commit.");
  console.log("Reminder: run `npm run export:tutorial-html` if you need a fresh local HTML export.");
  console.log("Generated HTML stays local under dist/matt-pocock-skills-html/ and is not committed.");
}

if (require.main === module) {
  runReminder();
}

module.exports = {
  changedFilesForLastCommit,
  shouldRemindForChangedFiles,
};
