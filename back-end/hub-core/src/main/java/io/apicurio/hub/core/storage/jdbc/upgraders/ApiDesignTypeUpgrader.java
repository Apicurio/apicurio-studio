/*
 * Copyright 2019 JBoss Inc
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

package io.apicurio.hub.core.storage.jdbc.upgraders;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.apache.commons.io.IOUtils;
import org.jdbi.v3.core.Handle;
import org.jdbi.v3.core.mapper.RowMapper;
import org.jdbi.v3.core.statement.StatementContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.apicurio.hub.core.beans.ApiDesignResourceInfo;
import io.apicurio.hub.core.beans.ApiDesignType;
import io.apicurio.hub.core.storage.jdbc.IDbUpgrader;

/**
 * A DB upgrader that populates the new "api_type" column that was introduces in version 8 of the
 * database schema.  The value of this field is derived from the spec version of the content
 * @author eric.wittmann@gmail.com
 */
public class ApiDesignTypeUpgrader implements IDbUpgrader {
    
    private static Logger logger = LoggerFactory.getLogger(ApiDesignTypeUpgrader.class);

    /**
     * @see io.apicurio.hub.core.storage.jdbc.IDbUpgrader#upgrade(org.jdbi.v3.core.Handle)
     */
    @Override
    public void upgrade(Handle dbHandle) throws Exception {
        logger.debug("Setting the value of 'api_type' for all rows in 'api_designs'.");

        // Explanation of query:
        //   - Select all rows from api_designs (we want to update the "api_type" column for each such row)
        //   - Include in the result set the raw content (any "Document" row from the api_content table)
        String query = "SELECT d.* FROM api_designs d WHERE d.api_type IS NULL";

        Connection connection = dbHandle.getConnection();
        Statement statement = connection.createStatement(ResultSet.TYPE_FORWARD_ONLY, ResultSet.CONCUR_UPDATABLE);
        ResultSet resultSet = statement.executeQuery(query);
        
        long rowCount = 0;
        while (resultSet.next()) {
            String designId = resultSet.getString("id");
            ApiDesignType apiType = getApiType(dbHandle, designId);
            resultSet.updateString("api_type", apiType.name());
            resultSet.updateRow();
            rowCount++;
        }
        
        logger.debug("Updated " + rowCount + " rows (added api_type column to every row).");
    }

    /**
     * Figures out the right API type by loading the actual content of the API, parsing it, and 
     * checking the spec version.
     * @param dbHandle
     * @param designId
     */
    private ApiDesignType getApiType(Handle dbHandle, String designId) {
        String query = "SELECT c.data FROM api_content c WHERE c.type = 0 AND c.design_id = ? LIMIT 1";
        String content = dbHandle.createQuery(query)
            .bind(0, Long.parseLong(designId))
            .map(new RowMapper<String>() {
                @Override
                public String map(ResultSet rs, StatementContext ctx) throws SQLException {
                    try {
                        return IOUtils.toString(rs.getCharacterStream("data"));
                    } catch (IOException e) {
                        throw new SQLException("Error reading data from 'api_content'.", e);
                    }
                }
            })
            .one();
        try {
            ApiDesignResourceInfo info = ApiDesignResourceInfo.fromContent(content);
            return info.getType();
        } catch (Exception e) {
            logger.error("Error determining specification type from content for API with ID: " + designId, e);
            return ApiDesignType.OpenAPI20;
        }
    }

}
