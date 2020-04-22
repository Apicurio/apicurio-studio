/*
 * Copyright 2020 JBoss Inc
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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.inject.Instance;
import javax.enterprise.inject.Produces;
import javax.inject.Inject;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

/**
 * @author carnalca@redhat.com
 */
public class DataSourceResolver {

    private static final Logger logger = LoggerFactory.getLogger(DataSourceResolver.class);

    @Inject
    private Instance<DataSource> dataSources;

    @Produces
    @ApicurioDataSource
    public DataSource dataSource() throws NamingException {

        if (dataSources.isUnsatisfied()) {
           return fetchJdniDataSource();
        } else {
            return dataSources.get();
        }
    }

    private DataSource fetchJdniDataSource() throws NamingException {
        logger.debug("Creating an instance of Datasource for injection");

        Context ctx = new InitialContext();
        return (DataSource) ctx.lookup("java:jboss/datasources/ApicurioDS");
    }
}
