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

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

/**
 * H2 implementation of the sql statements interface.  Provides sql statements that
 * are specific to H2, where applicable.
 * @author eric.wittmann@gmail.com
 */
public class H2SqlStatements extends CommonSqlStatements {

    /**
     * @see io.apicurio.hub.api.storage.jdbc.ISqlStatements#isDatabaseInitialized()
     */
    @Override
    public String isDatabaseInitialized() {
        return "SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_name = 'api_designs'";
    }

    /**
     * @see io.apicurio.hub.api.storage.jdbc.ISqlStatements#databaseInitialization()
     */
    @Override
    public List<String> databaseInitialization() {
        DdlParser parser = new DdlParser();
        try (InputStream input = getClass().getResourceAsStream("hub_h2.ddl")) {
            return parser.parse(input);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}
