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
                id: "local",
                name: "local-registry",
                registryUrl: "http://localhost:8080/"
            }
        ]
    },
    ui: {
        contextPath: "/",
        navPrefixPath: "/"
    },
};
