const ApicurioStudioConfig = {
    "ui": {
        "contextPath": "/",
        "navPrefixPath": ""
    },
    "apis": {
        "studio": "https://studio-api.dev.apicur.io/apis/studio/v1"
    },
    "components": {
        "masthead": {
            "show": true,
            "label": "APICURIO STUDIO"
        },
        "editors": {
            "url": "http://localhost:7070/editors"
        },
        "nav": {
            "show": false,
            "registry": "registry-nav"
        }
    },
    "auth": {
        "type": "oidc",
        "options": {
            "redirectUri": "http://localhost:8888",
            "clientId": "studio-ui",
            "url": "https://sso.dev.apicur.io/realms/apicurio"
        }
    }
};
