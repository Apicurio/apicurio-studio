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

package io.apicurio.studio.spi.storage;

import io.apicurio.common.apps.config.DynamicConfigSqlStorageStatements;
import io.apicurio.common.apps.storage.sql.SqlStatements;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
public interface StudioSqlStatements extends SqlStatements, DynamicConfigSqlStorageStatements {

    String insertDesignContent();

    String insertDesign();

    String selectDesign();

    String insertMetadata();

    String selectContentByDesignId();

    String updateContentByDesignId();

    String selectDesignMetadata();

    String countDesigns();

    String updateDesignMetadata();

    String deleteDesign();

    String deleteDesignMetadata();

    // TODO Deduplication?
    String deleteDesignContent();

    String insertDesignEvent();

    String selectDesignEvents();

    String searchDesignMetadata(SearchQuerySpecification spec);

    SearchQuerySpecification searchDesignMetadataSpecification();
}
