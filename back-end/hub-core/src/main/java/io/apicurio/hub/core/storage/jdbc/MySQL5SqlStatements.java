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

import io.apicurio.hub.core.config.HubConfiguration;

/**
 * H2 implementation of the sql statements interface.  Provides sql statements that
 * are specific to MySQL, where applicable.
 * @author eric.wittmann@gmail.com
 */
public class MySQL5SqlStatements extends CommonSqlStatements {
    
    /**
     * Constructor.
     * @param config
     */
    public MySQL5SqlStatements(HubConfiguration config) {
        super(config);
    }

    /**
     * @see io.apicurio.hub.core.storage.jdbc.CommonSqlStatements#dbType()
     */
    @Override
    protected String dbType() {
        return "mysql5";
    }

    /**
     * @see io.apicurio.hub.core.storage.jdbc.ISqlStatements#isDatabaseInitialized()
     */
    @Override
    public String isDatabaseInitialized() {
        return "SELECT count(*) AS count FROM information_schema.tables WHERE table_name = 'api_designs' LIMIT 1";
    }
    
    /**
     * @see io.apicurio.hub.core.storage.jdbc.ISqlStatements#supportsUpsert()
     */
    @Override
    public boolean supportsUpsert() {
        return true;
    }
    
    /**
     * @see io.apicurio.hub.core.storage.jdbc.ISqlStatements#upsertSharing()
     */
    @Override
    public String upsertSharing() {
        return "INSERT INTO sharing (design_id, uuid, level) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE level = ?";
    }

}
