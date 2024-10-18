#! /usr/bin/env node

const fs = require("fs");

const CONFIG_OUTPUT_PATH=process.env["APICURIO_CONFIG_OUTPUT_PATH"] || "/opt/app-root/src/config.js";

console.info("Generating application config at:", CONFIG_OUTPUT_PATH);

const APICURIO_REGISTRY_API_URL=process.env["APICURIO_REGISTRY_API_URL"] || "http://localhost:8080/apis/registry/v3";

const CONTEXT_PATH=process.env["APICURIO_CONTEXT_PATH"];
const NAV_PREFIX_PATH=process.env["APICURIO_NAV_PREFIX_PATH"];

const SHOW_MASTHEAD=process.env["APICURIO_SHOW_MASTHEAD"];
const MASTHEAD_LABEL=process.env["APICURIO_MASTHEAD_LABEL"];
const EDITORS_URL=process.env["APICURIO_EDITORS_URL"];

const AUTH_TYPE=process.env["APICURIO_AUTH_TYPE"];
const AUTH_URL=process.env["APICURIO_AUTH_URL"];
const AUTH_CLIENT_ID=process.env["APICURIO_AUTH_CLIENT_ID"];
const AUTH_REDIRECT_URL=process.env["APICURIO_AUTH_REDIRECT_URL"];

// Create the config to output.
const CONFIG = {
    apis: {
        registry: APICURIO_REGISTRY_API_URL
    },
    ui: {
        navPrefixPath: "",
        contextPath: "/"
    },
    components: {
        masthead: {
            show: true
        },
        editors: {
            url: "/editors/"
        }
    },
    auth: {}
};

// Configure UI elements
if (CONTEXT_PATH) {
    CONFIG.ui.contextPath = CONTEXT_PATH;
}
if (NAV_PREFIX_PATH) {
    CONFIG.ui.navPrefixPath = NAV_PREFIX_PATH;
}


// Configure Masthead elements
if (SHOW_MASTHEAD) {
    CONFIG.components.masthead.show = SHOW_MASTHEAD;
}
if (MASTHEAD_LABEL) {
    CONFIG.components.masthead.label = MASTHEAD_LABEL;
}

// Configure Editors elements
if (EDITORS_URL) {
    CONFIG.components.editors.url = EDITORS_URL;
}


// Configure auth
if (AUTH_TYPE) {
    CONFIG.auth.type = AUTH_TYPE;
}

if (AUTH_TYPE === "oidc") {
    CONFIG.auth.options = {};
    if (AUTH_URL) {
        CONFIG.auth.options.url = AUTH_URL;
    }
    if (AUTH_REDIRECT_URL) {
        CONFIG.auth.options.redirectUri = AUTH_REDIRECT_URL;
    }
    if (AUTH_CLIENT_ID) {
        CONFIG.auth.options.clientId = AUTH_CLIENT_ID_URL;
    }
    if (AUTH_CLIENT_SCOPES) {
        CONFIG.auth.options.scope = AUTH_CLIENT_SCOPES;
    }
}


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
