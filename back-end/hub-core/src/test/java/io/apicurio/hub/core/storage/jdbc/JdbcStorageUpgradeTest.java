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

package io.apicurio.hub.core.storage.jdbc;

import java.io.File;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.URL;
import java.sql.Connection;
import java.sql.Driver;
import java.sql.SQLException;
import java.util.Collection;
import java.util.Iterator;

import org.apache.commons.dbcp.BasicDataSource;
import org.h2.tools.RunScript;
import org.junit.Assert;
import org.junit.Test;

import io.apicurio.hub.core.beans.ApiDesign;
import io.apicurio.hub.core.beans.ApiDesignType;
import io.apicurio.hub.core.config.HubConfiguration;
import io.apicurio.test.core.TestUtil;

/**
 * @author eric.wittmann@gmail.com
 */
public class JdbcStorageUpgradeTest {
    
    static {
        System.setProperty("org.slf4j.simpleLogger.logFile", "System.out");
    }

    @Test
    public void testUpgradeFromVersion7toVersion8() throws Exception {
        BasicDataSource ds = createDatasourceFrom("upgrade-test.v7to8.mv.sql");
        try {
            HubConfiguration config = new HubConfiguration();
            H2SqlStatements sqlStatements = new H2SqlStatements(config);
            JdbcStorage storage = new JdbcStorage();
            TestUtil.setPrivateField(storage, "config", config);
            TestUtil.setPrivateField(storage, "dataSource", ds);
            TestUtil.setPrivateField(storage, "sqlStatements", sqlStatements);
            
            // Run the postConstruct method which will upgrade the DB to version 8
            storage.postConstruct();
            
            // List the API designs for eric - they should all have a "type" set!
            Collection<ApiDesign> designs = storage.listApiDesigns("eric.wittmann@gmail.com");
            Iterator<ApiDesign> diter = designs.iterator();
            ApiDesign design1 = diter.next();
            Assert.assertNotNull(design1.getType());
            Assert.assertEquals(design1.getType(), ApiDesignType.OpenAPI20);
            ApiDesign design2 = diter.next();
            Assert.assertNotNull(design2.getType());
            Assert.assertEquals(design2.getType(), ApiDesignType.OpenAPI30);
        } finally {
            ds.close();
        }
    }

    /**
     * Creates a datasource from a DB file found in the test resources.
     * @throws SQLException
     */
    private static BasicDataSource createDatasourceFrom(String sqlFileName) throws Exception {
        // Step 1 - copy the db file from the classpath to a temp location
        URL sqlUrl = JdbcStorageUpgradeTest.class.getResource(sqlFileName);
        Assert.assertNotNull(sqlUrl);
        File tempDbFile = File.createTempFile("_apicurio_junit", ".mv.db");
        tempDbFile.deleteOnExit();

        String jdbcUrl = "jdbc:h2:file:" + tempDbFile.getAbsolutePath().replaceAll(".mv.db", "");
        
        // Step 2 - create a datasource from the file path
        BasicDataSource ds = new BasicDataSource();
        ds.setDriverClassName(Driver.class.getName());
        ds.setUsername("sa");
        ds.setPassword("sa");
        ds.setUrl(jdbcUrl);
        
        try (Connection connection = ds.getConnection(); Reader reader = new InputStreamReader(sqlUrl.openStream())) {
            RunScript.execute(connection, reader);
        }
        
        return ds;
    }
}
