/*
 * Copyright 2021 Red Hat
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

package io.apicurio.studio.storage;

import io.apicurio.common.apps.storage.sql.CommonSqlStatements;

/**
 * Returns SQL statements used by the storage implementation.  There are different
 * implementations of this interface depending on the database being used.
 * @author eric.wittmann@gmail.com
 */
public interface SqlStatements extends CommonSqlStatements {

    /**
     * A statement used to insert a row into the globalrules table.
     */
    public String insertTeam();

    /**
     * A statement used to select all global rules.
     */
    public String selectTeams();
    public String countTeams();

    /**
     * A statement used to delete a row from the globalrules table.
     */
    public String deleteTeam();

    /**
     * A statement used to update information about a global rule.
     */
    public String updateTeam();

}
