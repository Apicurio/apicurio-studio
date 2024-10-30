#! /usr/bin/env node

const fs = require("fs");

const INDEXHTML_PATH=process.env["APICURIO_INDEXHTML_PATH"] || "/opt/app-root/src/index.html";

console.info("Updating base href in index.html file at:", INDEXHTML_PATH);

const CONTEXT_PATH=process.env["APICURIO_CONTEXT_PATH"] || "/";

// Read the index.html file
fs.readFile(INDEXHTML_PATH, "utf8", (err, data) => {
    if (err) {
        console.error("Error reading index.html:", err);
        return;
    }

    var newBaseHref = `<base href="${CONTEXT_PATH}">`;

    // Use a regular expression to match the <base> tag and replace the href attribute
    const updatedHtml = data.replace(
        /<base.href=...>/i,
        newBaseHref
    );

    // Write the updated HTML back to the file
    fs.writeFile(INDEXHTML_PATH, updatedHtml, "utf8", (err) => {
        if (err) {
            console.error("Error writing the index.html file:", err);
        } else {
            console.log("Successfully updated the base href value.");
        }
    });
});
