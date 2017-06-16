/*
 * Copyright 2017 JBoss Inc
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

package io.apicurio.hub.api.storage.jdbc;

import java.util.Collections;
import java.util.List;
import java.util.Set;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.sql.DataSource;

import org.jdbi.v3.core.Jdbi;
import org.jdbi.v3.core.result.ResultIterable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.apicurio.hub.api.beans.ApiDesign;
import io.apicurio.hub.api.config.Configuration;
import io.apicurio.hub.api.exceptions.AlreadyExistsException;
import io.apicurio.hub.api.exceptions.NotFoundException;
import io.apicurio.hub.api.storage.IStorage;
import io.apicurio.hub.api.storage.StorageException;

/**
 * A JDBC/SQL implementation of the storage layer.
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class JdbcStorage implements IStorage {

    private static Logger logger = LoggerFactory.getLogger(JdbcStorage.class);

    @Inject
    private Configuration config;
    @Resource(mappedName="java:jboss/datasources/ExampleDS")
    private DataSource dataSource;
    
    private ISqlStatements sqlStatements;
    private Jdbi jdbi;
    
    @PostConstruct
    public void postConstruct() {
        logger.debug("JDBC Storage constructed successfully.");
        logger.debug("Injected config: " + config);
        logger.debug("Injected DS:     " + dataSource);

        jdbi = Jdbi.create(dataSource);

        if (config.getJdbcType().equalsIgnoreCase("h2")) {
            sqlStatements = new H2SqlStatements();
        } else {
            throw new RuntimeException("Unsupported JDBC type: " + config.getJdbcType());
        }
        
        if (config.isJdbcInit()) {
            if (!isDatabaseInitialized()) {
                logger.debug("Database not initialized.");
                initializeDatabase();
            }
        }
    }
    
    /**
     * @return true if the database has already been initialized
     */
    private boolean isDatabaseInitialized() {
        logger.debug("Checking to see if the DB is initialized.");
        return this.jdbi.withHandle(handle -> {
            ResultIterable<Integer> result = handle.createQuery(this.sqlStatements.isDatabaseInitialized()).mapTo(Integer.class);
            return result.findOnly().intValue() > 0;
        });
    }

    /**
     * Initializes the database by executing a number of DDL statements.
     */
    private void initializeDatabase() {
        logger.info("Initializing the Apicurio Hub API database.");
        logger.info("\tDatabase type: " + config.getJdbcType());
        
        final List<String> statements = this.sqlStatements.databaseInitialization();
        logger.debug("---");
        this.jdbi.withHandle( handle -> {
            statements.forEach( statement -> {
                logger.debug(statement);
                handle.createUpdate(statement).execute();
            });
            return null;
        });
        logger.debug("---");
    }

    /**
     * @see io.apicurio.hub.api.storage.IStorage#getApiDesign(java.lang.String)
     */
    @Override
    public ApiDesign getApiDesign(String designId) throws NotFoundException, StorageException {
        // TODO Auto-generated method stub
        return null;
    }

    /**
     * @see io.apicurio.hub.api.storage.IStorage#createApiDesign(io.apicurio.hub.api.beans.ApiDesign)
     */
    @Override
    public void createApiDesign(ApiDesign design) throws AlreadyExistsException, StorageException {
        // TODO Auto-generated method stub
        
    }

    /**
     * @see io.apicurio.hub.api.storage.IStorage#deleteApiDesign(java.lang.String)
     */
    @Override
    public void deleteApiDesign(String designId) throws NotFoundException, StorageException {
        // TODO Auto-generated method stub
        
    }

    /**
     * @see io.apicurio.hub.api.storage.IStorage#listApiDesigns()
     */
    @Override
    public Set<ApiDesign> listApiDesigns() throws StorageException {
        return Collections.EMPTY_SET;
    }

}
