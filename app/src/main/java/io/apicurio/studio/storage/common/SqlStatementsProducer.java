package io.apicurio.studio.storage.common;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;

import io.apicurio.common.apps.storage.sql.SqlStatements;
import io.apicurio.studio.spi.storage.StudioSqlStatements;
import io.apicurio.studio.storage.h2.H2StudioSqlStatements;
import io.apicurio.studio.storage.postgresql.PostgresStudioSqlStatements;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Produces;
import jakarta.inject.Inject;
import jakarta.inject.Named;

@ApplicationScoped
public class SqlStatementsProducer {

    @Inject
    Logger log;

    @ConfigProperty(name = "apicurio.storage.db-kind", defaultValue = "h2")
    String databaseType;

    /**
     * Produces an {@link SqlStatements} instance for injection.
     */
    @Produces
    @ApplicationScoped
    @Named("apicurioSqlStatements")
    public StudioSqlStatements createSqlStatements() {
        log.debug("Creating an instance of ISqlStatements for DB: " + databaseType);
        if ("h2".equals(databaseType)) {
            return new H2StudioSqlStatements();
        }
        if ("postgresql".equals(databaseType)) {
            return new PostgresStudioSqlStatements();
        }
        throw new RuntimeException("Unsupported database type: " + databaseType);
    }
}