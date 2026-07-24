const { exportAllTutorialsHtml } = require("./export-tutorial-html.cjs");

exportAllTutorialsHtml()
  .then(({ outputDir, tutorials }) => {
    console.log(`Exported ${tutorials.length} tutorials to ${outputDir}`);
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
