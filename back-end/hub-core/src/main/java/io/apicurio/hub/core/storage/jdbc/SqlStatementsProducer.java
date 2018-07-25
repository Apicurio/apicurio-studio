/*
 * Copyright 2018 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.apicurio.hub.core.storage.jdbc;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Produces;
import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.apicurio.hub.core.config.HubConfiguration;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class SqlStatementsProducer {
    private static Logger logger = LoggerFactory.getLogger(SqlStatementsProducer.class);

    @Inject
    private HubConfiguration config;
    
    /**
     * Produces an {@link ISqlStatements} instance for injection.
     */
    @Produces @ApplicationScoped
    public ISqlStatements createSqlStatements() {
        logger.debug("Creating an instance of ISqlStatements for DB: " + config.getJdbcType());
        switch (config.getJdbcType()) {
            case "h2":
                return new H2SqlStatements(config);
            case "mysql5":
                return new MySQL5SqlStatements(config);
            case "postgresql9":
                return new PostgreSQL9SqlStatements(config);
            default:
                throw new RuntimeException("Unsupported JDBC type: " + config.getJdbcType());
        }
    }

}
