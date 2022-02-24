var ApicurioConfig = {
    auth: {
        type: "none"
    },
    features: {},
    instances: {
        auth: {
            type: "none"
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
