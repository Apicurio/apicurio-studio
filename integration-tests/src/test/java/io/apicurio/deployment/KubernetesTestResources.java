package io.apicurio.deployment;

public class KubernetesTestResources {

    protected static final String E2E_NAMESPACE_RESOURCE = "/infra/e2e-namespace.yml";
    protected static final String STUDIO_OPENSHIFT_ROUTE = "/infra/openshift/studio-route.yml";
    protected static final String APPLICATION_IN_MEMORY_RESOURCES = "/infra/in-memory/studio-in-memory.yml";
    protected static final String APPLICATION_SQL_RESOURCES = "/infra/sql/studio-sql.yml";

    protected static final String APPLICATION_IN_MEMORY_SECURED_RESOURCES = "/infra/in-memory/studio-in-memory-secured.yml";
    protected static final String APPLICATION_SQL_SECURED_RESOURCES = "/infra/sql/studio-sql-secured.yml";
    protected static final String DATABASE_RESOURCES = "/infra/sql/postgresql.yml";
    protected static final String KEYCLOAK_RESOURCES = "/infra/auth/keycloak.yml";
    protected static final String TEST_NAMESPACE = "apicurio-studio-e2e";
    protected static final String APPLICATION_SERVICE = "apicurio-studio-service";
    protected static final String KEYCLOAK_SERVICE = "keycloak-service";
}
