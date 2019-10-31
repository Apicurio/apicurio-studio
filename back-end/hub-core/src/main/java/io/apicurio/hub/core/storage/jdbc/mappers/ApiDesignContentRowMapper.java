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

package io.apicurio.hub.core.storage.jdbc.mappers;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.apache.commons.io.IOUtils;
import org.jdbi.v3.core.mapper.RowMapper;
import org.jdbi.v3.core.statement.StatementContext;

import io.apicurio.hub.core.beans.ApiDesignContent;

/**
 * A row mapper to read a 'document' style row from the api_content table.
 * @author eric.wittmann@gmail.com
 */
public class ApiDesignContentRowMapper implements RowMapper<ApiDesignContent> {
    
    public static final ApiDesignContentRowMapper instance = new ApiDesignContentRowMapper();

    /**
     * @see org.jdbi.v3.core.mapper.RowMapper#map(java.sql.ResultSet, org.jdbi.v3.core.statement.StatementContext)
     */
    @Override
    public ApiDesignContent map(ResultSet rs, StatementContext ctx) throws SQLException {
        try {
            ApiDesignContent content = new ApiDesignContent();
            content.setContentVersion(rs.getLong("version"));
            content.setDocument(IOUtils.toString(rs.getCharacterStream("data")));
            return content;
        } catch (IOException e) {
            throw new SQLException(e);
        }
    }

}