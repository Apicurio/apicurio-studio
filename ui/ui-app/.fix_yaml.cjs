const cwd = process.cwd();
const settings = require( cwd + "/package.json" );
const fs = require("fs");

const fixedPackageJson = {
    type: "module",
    version: settings.dependencies ? settings.dependencies.yaml : settings.peerDependencies.yaml
};

const packageJsonFile1 = `${cwd}/node_modules/yaml/browser/package.json`;
const packageJsonFile2 = `${cwd}/node_modules/yaml/browser/dist/package.json`;

const packageJsonFileContent = JSON.stringify(fixedPackageJson);

fs.writeFileSync(packageJsonFile1, packageJsonFileContent);
fs.writeFileSync(packageJsonFile2, packageJsonFileContent);
