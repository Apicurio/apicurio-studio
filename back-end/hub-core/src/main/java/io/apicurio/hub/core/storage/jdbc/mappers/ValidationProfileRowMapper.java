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

import org.apache.commons.io.IOUtils;
import org.jdbi.v3.core.mapper.RowMapper;
import org.jdbi.v3.core.statement.StatementContext;

import io.apicurio.hub.core.beans.ValidationProfile;
import io.apicurio.hub.core.beans.ValidationSeverity;

/**
 * A row mapper to read a validation profile from a db row.
 * @author eric.wittmann@gmail.com
 */
public class ValidationProfileRowMapper implements RowMapper<ValidationProfile> {
    
    public static final ValidationProfileRowMapper instance = new ValidationProfileRowMapper();

    /**
     * @see org.jdbi.v3.core.mapper.RowMapper#map(java.sql.ResultSet, org.jdbi.v3.core.statement.StatementContext)
     */
    @Override
    public ValidationProfile map(ResultSet rs, StatementContext ctx) throws SQLException {
        try {
            ValidationProfile profile = new ValidationProfile();
            profile.setId(rs.getLong("id"));
            profile.setName(rs.getString("name"));
            profile.setDescription(rs.getString("description"));
            profile.setSeverities(ValidationProfileRowMapper.toSeverities(IOUtils.toString(rs.getCharacterStream("severities"))));
            profile.setExternalRuleset(rs.getString("external_ruleset"));
            return profile;
        } catch (IOException e) {
            throw new SQLException(e);
        }
    }

    public static final Map<String, ValidationSeverity> toSeverities(String severityData) {
        Map<String, ValidationSeverity> map = new HashMap<>();
        if (severityData != null) {
            try (BufferedReader reader = new BufferedReader(new StringReader(severityData))) {
                String line = reader.readLine();
                while (line != null) {
                    int idx = line.indexOf('=');
                    if (idx != -1) {
                        String key = line.substring(0, idx);
                        String val = line.substring(idx + 1);
                        map.put(key, ValidationSeverity.valueOf(val));
                    }
                    line = reader.readLine();
                }
            } catch (IOException e) {}
        }
        return map;
    }
    
    public static final String toString(Map<String, ValidationSeverity> severities) {
        StringBuilder builder = new StringBuilder();
        for (Entry<String, ValidationSeverity> entry : severities.entrySet()) {
            if (entry.getValue() != null) {
                builder.append(entry.getKey());
                builder.append("=");
                builder.append(entry.getValue().name());
                builder.append("\n");
            }
        }
        return builder.toString();
    }

}