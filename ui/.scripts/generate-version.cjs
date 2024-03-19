#! /usr/bin/env node
var shell = require("shelljs");
const fs = require("fs");
const packageJson = require('../package.json');

console.info("-------------------------------------------------------");
console.info("Getting current git SHA");
const gitSHA = shell.exec("git rev-parse HEAD", { silent: true }).stdout.trim();
console.info(`   SHA: ${gitSHA}`);
console.info("-------------------------------------------------------");

console.info("-------------------------------------------------------");
console.info("Generating version.js");
console.info("-------------------------------------------------------");


const VERSION_OUTPUT_PATH="./ui-app/dist/version.js";

// Generate the version.js file.
const info = {
    name: "Apicurio Studio",
    version: packageJson.version,
    digest: gitSHA,
    builtOn: new Date(),
    url: "https://www.apicur.io/studio/"
};

const FILE_CONTENT = `
const ApicurioInfo = ${JSON.stringify(info, null, 4)};
`;
console.info(FILE_CONTENT);
console.info("-------------------------------------------------------");

fs.writeFile(VERSION_OUTPUT_PATH, FILE_CONTENT, "utf8", (err) => {
    if (err) {
      console.error("Error writing config to file:", err);
      return;
    }
    console.log("Config successfully written to file.");
});
