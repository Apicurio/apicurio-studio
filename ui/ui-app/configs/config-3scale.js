const ApicurioStudioConfig = {
    apis: {
        registry: "https://registry-api.dev.apicur.io/apis/registry/v3"
    },
    auth: {
        type: "oidc",
        options: {
            redirectUri: "http://localhost:8888/",
            clientId: "studio-ui",
            url: "https://sso.dev.apicur.io/realms/apicurio"
        }
    },
    links: {
        registry: "https://registry.dev.apicur.io"
    },
    components: {
        editors: {
            url: "http://localhost:9011"
        },
        masthead: {
            show: true
        }
    },
    ui: {
        navPrefixPath: "",
        contextPath: "/"
    }
};
