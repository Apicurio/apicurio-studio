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

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import io.apicurio.hub.core.beans.ApiTemplatePublication;
import org.jdbi.v3.core.mapper.RowMapper;
import org.jdbi.v3.core.statement.StatementContext;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * A row mapper to read a template row from the api_content table.
 * @author c.desc2@gmail.com
 */
public class ApiTemplatePublicationRowMapper implements RowMapper<ApiTemplatePublication> {
    
    public static final ApiTemplatePublicationRowMapper instance = new ApiTemplatePublicationRowMapper();
    
    private final ObjectReader reader = new ObjectMapper().findAndRegisterModules().readerFor(ApiTemplatePublication.class);

    /**
     * @see RowMapper#map(ResultSet, StatementContext)
     */
    @Override
    public ApiTemplatePublication map(ResultSet rs, StatementContext ctx) throws SQLException {
        try {
            ApiTemplatePublication pojo = reader.readValue(rs.getCharacterStream("data"));
            pojo.setDesignId(rs.getString("design_id"));
            pojo.setCreatedBy(rs.getString("created_by"));
            pojo.setCreatedOn(rs.getTimestamp("created_on"));
            return pojo;
        } catch (IOException e) {
            throw new SQLException(e);
        }
    }

}