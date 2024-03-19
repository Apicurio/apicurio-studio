const shell = require("shelljs");

shell.rm("-rf", "dist");
shell.mkdir("-p", "dist/editors");

shell.cp("-r", "./ui-app/dist/*", "dist");
shell.cp("-r", "./ui-editors/dist/*", "dist/editors");
