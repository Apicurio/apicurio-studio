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

package io.apicurio.studio.storage.h2;

import io.apicurio.common.apps.storage.exceptions.StorageException;
import io.apicurio.common.apps.storage.sql.jdbi.Handle;
import io.apicurio.common.apps.storage.sql.jdbi.query.Update;
import io.apicurio.common.apps.storage.sql.jdbi.query.UpdateImpl;
import io.apicurio.studio.spi.storage.StudioSqlStatements;
import io.apicurio.studio.storage.common.AbstractStudioSqlStatements;

import java.sql.SQLException;

/**
 * @author eric.wittmann@gmail.com
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
public class H2StudioSqlStatements extends AbstractStudioSqlStatements implements StudioSqlStatements {

    @Override
    public boolean isDatabaseInitialized(Handle handle) throws StorageException {
        int count = handle.createQuery("SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_name = 'APICURIO'")
                .mapTo(Integer.class).one();
        return count > 0;
    }

    @Override
    public String dbType() {
        return "h2";
    }

    @Override
    public boolean isPrimaryKeyViolation(SQLException ex) {
        return ex.getMessage() != null && ex.getMessage().contains("primary key violation");
    }

    @Override
    public boolean isForeignKeyViolation(SQLException ex) {
        return ex.getMessage() != null && ex.getMessage().contains("Referential integrity constraint violation");
    }

    @Override
    public Update setStorageProperty(String key, String value) {
        var q = new UpdateImpl("""
                MERGE INTO apicurio (prop_key, prop_value) KEY(prop_key) VALUES (?, ?)\
                """);
        return q.bind(0, key)
                .bind(1, value);
    }

    @Override
    public String getNextSequenceValue() {
        // H2 does not support atomic increment
        throw new UnsupportedOperationException();
    }

    @Override
    public String getSequenceValue() {
        return """
                SELECT s.seq_value FROM sequences s \
                WHERE s.seq_key = ?\
                """;
    }

    @Override
    public String casSequenceValue() {
        return """
                UPDATE sequences s \
                SET seq_value = ? \
                WHERE s.seq_key = ? AND s.seq_value = ?\
                """;
    }

    @Override
    public String insertSequenceValue() {
        return """
                INSERT INTO sequences (seq_key, seq_value) \
                VALUES (?, ?)\
                """;
    }
}
