const ApicurioStudioConfig = {
    "ui": {
        "contextPath": "/",
        "navPrefixPath": ""
    },
    "apis": {
        "studio": "http://localhost:8080/apis/studio/v1"
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
            "clientId": "apicurio-studio",
            "url": "https://auth.apicur.io/auth/realms/apicurio-local"
        }
    }
};
