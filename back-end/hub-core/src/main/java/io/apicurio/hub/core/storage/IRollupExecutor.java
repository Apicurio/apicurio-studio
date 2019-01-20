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
package io.apicurio.hub.core.storage;

import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.js.OaiCommandException;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public interface IRollupExecutor {


    /**
     * Finds all commands executed since the last full content rollup and applies
     * them to the API design.  This produces a "latest" version of the API
     * and stores that as a new content entry in the storage.
     */
    void rollupCommands(String userId, String designId) throws NotFoundException, StorageException, OaiCommandException;

    /**
     * As {@link #rollupCommands(String, String)}, but infers userId from the database
     * by retrieving the last command on the design and extracting its user.
     *
     * This may be useful in distributed setups, where the node performing a rollup
     * does not actually host the given user.
     */
    void rollupCommands(String designId) throws NotFoundException, StorageException, OaiCommandException;


}
