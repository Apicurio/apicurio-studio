package io.apicurio.studio.test.resource;


import io.quarkus.test.common.QuarkusTestResourceLifecycleManager;
import org.testcontainers.containers.PostgreSQLContainer;

import java.util.Map;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
public class PostgresqlResource implements QuarkusTestResourceLifecycleManager {

    static PostgreSQLContainer<?> POSTGRESQL =
            new PostgreSQLContainer<>("postgres:latest") // Use the latest tag to alert us on incompatibilities
                    .withDatabaseName("studio")
                    .withUsername("postgres")
                    .withPassword("postgres");

    @Override
    public Map<String, String> start() {
        POSTGRESQL.start();
        return Map.of(
                "apicurio.datasource.url", POSTGRESQL.getJdbcUrl(),
                "apicurio.datasource.username", "postgres",
                "apicurio.datasource.password", "postgres"
        );
    }

    @Override
    public void stop() {
        POSTGRESQL.stop();
    }
}
