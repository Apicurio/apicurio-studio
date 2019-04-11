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

import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.IOUtils;
import org.jdbi.v3.core.mapper.RowMapper;
import org.jdbi.v3.core.statement.StatementContext;

import io.apicurio.hub.core.beans.CodegenProject;
import io.apicurio.hub.core.beans.CodegenProjectType;

/**
 * A row mapper to read a single row from the codegen table.
 * @author eric.wittmann@gmail.com
 */
public class CodegenProjectRowMapper implements RowMapper<CodegenProject> {
    
    public static final CodegenProjectRowMapper instance = new CodegenProjectRowMapper();

    /**
     * @see org.jdbi.v3.core.mapper.RowMapper#map(java.sql.ResultSet, org.jdbi.v3.core.statement.StatementContext)
     */
    @Override
    public CodegenProject map(ResultSet rs, StatementContext ctx) throws SQLException {
        try {
            CodegenProject project = new CodegenProject();
            project.setId(String.valueOf(rs.getLong("id")));
            project.setCreatedBy(rs.getString("created_by"));
            project.setCreatedOn(rs.getTimestamp("created_on"));
            project.setModifiedBy(rs.getString("modified_by"));
            project.setModifiedOn(rs.getTimestamp("modified_on"));
            project.setDesignId(String.valueOf(rs.getLong("design_id")));
            project.setType(CodegenProjectType.valueOf(rs.getString("ptype")));
            project.setAttributes(toMap(IOUtils.toString(rs.getCharacterStream("attributes"))));
            return project;
        } catch (IOException e) {
            throw new SQLException(e);
        }
    }

    public static String toString(Map<String, String> attributes) {
        StringBuilder builder = new StringBuilder();
        for (Entry<String, String> entry : attributes.entrySet()) {
            if (entry.getValue() != null) {
                builder.append(entry.getKey());
                builder.append("=");
                builder.append(Base64.encodeBase64String(entry.getValue().getBytes()));
                builder.append("\n");
            }
        }
        return builder.toString();
    }

    public static Map<String, String> toMap(String attributes) {
        Map<String, String> map = new HashMap<>();
        if (attributes != null) {
            try (BufferedReader reader = new BufferedReader(new StringReader(attributes))) {
                String line = reader.readLine();
                while (line != null) {
                    int idx = line.indexOf('=');
                    if (idx != -1) {
                        String key = line.substring(0, idx);
                        String val = line.substring(idx + 1);
                        val = new String(Base64.decodeBase64(val));
                        map.put(key, val);
                    }
                    line = reader.readLine();
                }
            } catch (IOException e) {}
        }
        return map;
    }

}