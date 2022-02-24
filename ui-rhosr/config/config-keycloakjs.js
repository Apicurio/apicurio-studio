var ApicurioConfig = {
    auth: {
        type: "keycloakjs",
        options: {
            url: "https://studio-auth.apicur.io/auth",
            realm: "apicurio-local",
            clientId:"apicurio-registry",
            onLoad: "login-required"
        }
    },
    features: {},
    instances: {
        auth: {
            type: "keycloakjs"
        }
    },
    registries: {
        auth: {
            type: "none"
        },
        static: [
            {
                id: "local-1",
                name: "local-registry-1",
                registryUrl: "http://localhost:8080/"
            },
            {
                id: "local-2",
                name: "local-registry-2",
                registryUrl: "http://localhost:8081/"
            }
        ]
    },
    ui: {
        contextPath: "/",
        editorAppUrl: "http://localhost:4200",
        navPrefixPath: "/"
    },
};
