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

import io.apicurio.hub.core.beans.ApiDesignType;
import io.apicurio.hub.core.beans.StoredApiTemplate;
import org.apache.commons.io.IOUtils;
import org.jdbi.v3.core.mapper.RowMapper;
import org.jdbi.v3.core.statement.StatementContext;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * A row mapper to read a 'template' row from the templates table.
 * @author c.desc2@gmail.com
 */
public class StoredApiTemplateRowMapper implements RowMapper<StoredApiTemplate> {
    
    public static final StoredApiTemplateRowMapper instance = new StoredApiTemplateRowMapper();

    /**
     * @see RowMapper#map(ResultSet, StatementContext)
     */
    @Override
    public StoredApiTemplate map(ResultSet rs, StatementContext ctx) throws SQLException {
        try {
            StoredApiTemplate template = new StoredApiTemplate();
            template.setTemplateId(rs.getString("template_id"));
            template.setName(rs.getString("name"));
            template.setType(ApiDesignType.valueOf(rs.getString("api_type")));
            template.setDescription(rs.getString("description"));
            template.setOwner(rs.getString("owner"));
            template.setDocument(IOUtils.toString(rs.getCharacterStream("template")));
            return template;
        } catch (IOException e) {
            throw new SQLException(e);
        }
    }

}