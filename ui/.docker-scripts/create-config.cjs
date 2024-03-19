#! /usr/bin/env node

const fs = require("fs");

const CONFIG_OUTPUT_PATH=process.env["APICURIO_CONFIG_OUTPUT_PATH"] || "/opt/app-root/src/config.js";

console.info("Generating application config at:", CONFIG_OUTPUT_PATH);

const CONTEXT_PATH=process.env["APICURIO_CONTEXT_PATH"] || "/";
const NAV_PREFIX_PATH=process.env["APICURIO_NAV_PREFIX_PATH"] || "";
const APICURIO_STUDIO_API_URL=process.env["APICURIO_STUDIO_API_URL"] || "/apis/studio/v1";
const SHOW_MASTHEAD=process.env["APICURIO_SHOW_MASTHEAD"] || "true";
const MASTHEAD_LABEL=process.env["APICURIO_MASTHEAD_LABEL"] || "APICURIO STUDIO";
const EDITORS_URL=process.env["APICURIO_EDITORS_URL"] || "/editors/";

const AUTH_TYPE=process.env["APICURIO_AUTH_TYPE"] || "none";
const AUTH_URL=process.env["APICURIO_AUTH_URL"] || "";
const AUTH_CLIENT_ID=process.env["APICURIO_AUTH_CLIENT_ID"] || "api-studio-ui";
const AUTH_REDIRECT_URL=process.env["APICURIO_AUTH_REDIRECT_URL"] || "";

// Create the config to output.
const CONFIG = {
    "apis": {
        "studio": APICURIO_STUDIO_API_URL
    },
    "ui": {
        "contextPath": CONTEXT_PATH,
        "navPrefixPath": NAV_PREFIX_PATH
    },
    "components": {
        "masthead": {
            "show": SHOW_MASTHEAD === "true",
            "label": MASTHEAD_LABEL
        },
        "editors": {
            "url": EDITORS_URL
        },
        "nav": {
            "show": false,
            "registry": "registry-nav"
        }
    },
    "auth": {
        "type": AUTH_TYPE,
        "options": {
            "redirectUri": AUTH_REDIRECT_URL,
            "clientId": AUTH_CLIENT_ID,
            "url": AUTH_URL
        }
    }
};

const FILE_CONTENT = `
const ApicurioStudioConfig = ${JSON.stringify(CONFIG, null, 4)};
`;

fs.writeFile(CONFIG_OUTPUT_PATH, FILE_CONTENT, "utf8", (err) => {
    if (err) {
      console.error("Error writing config to file:", err);
      return;
    }
    console.log("Config successfully written to file.");
});
