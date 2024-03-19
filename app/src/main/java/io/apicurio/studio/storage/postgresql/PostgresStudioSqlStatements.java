/*
 * Copyright 2020 Red Hat
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

package io.apicurio.studio.storage.postgresql;

import io.apicurio.common.apps.storage.exceptions.StorageException;
import io.apicurio.common.apps.storage.sql.jdbi.Handle;
import io.apicurio.common.apps.storage.sql.jdbi.query.Update;
import io.apicurio.common.apps.storage.sql.jdbi.query.UpdateImpl;
import io.apicurio.studio.spi.storage.StudioSqlStatements;
import io.apicurio.studio.storage.common.AbstractStudioSqlStatements;

import java.sql.SQLException;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
public class PostgresStudioSqlStatements extends AbstractStudioSqlStatements implements StudioSqlStatements {

    @Override
    public String dbType() {
        return "postgresql";
    }

    @Override
    public boolean isPrimaryKeyViolation(SQLException ex) {
        return ex.getMessage() != null && ex.getMessage().contains("violates unique constraint");
    }

    @Override
    public boolean isForeignKeyViolation(SQLException ex) {
        return ex.getMessage() != null && ex.getMessage().contains("violates foreign key constraint");
    }

    @Override
    public boolean isDatabaseInitialized(Handle handle) throws StorageException {
        int count = handle.createQuery("SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_name = 'apicurio'")
                .mapTo(Integer.class).one();
        return count > 0;
    }

    @Override
    public Update setStorageProperty(String key, String value) {
        var q = new UpdateImpl("""
                INSERT INTO apicurio (prop_key, prop_value) VALUES (?, ?) \
                ON CONFLICT (prop_key) \
                DO UPDATE SET prop_value = ?\
                """);
        return q.bind(0, key)
                .bind(1, value)
                .bind(2, value);
    }

    @Override
    public String getNextSequenceValue() {
        return """
                INSERT INTO sequences (seq_key, seq_value) VALUES (?, 1) \
                ON CONFLICT (seq_key) \
                DO UPDATE SET seq_value = sequences.seq_value + 1 \
                RETURNING seq_value
                """;
    }

    @Override
    public String getSequenceValue() {
        // PostgreSQL supports atomic increment
        throw new UnsupportedOperationException();
    }

    @Override
    public String casSequenceValue() {
        // PostgreSQL supports atomic increment
        throw new UnsupportedOperationException();
    }

    @Override
    public String insertSequenceValue() {
        // PostgreSQL supports atomic increment
        throw new UnsupportedOperationException();
    }
}
