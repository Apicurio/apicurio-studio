/*
 * Copyright 2019 Red Hat
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

package io.apicurio.hub.core.editing.ops;

/**
 * Message/op used to communicate that an error occurred when storing a command in the DB.
 * @author eric.wittmann@gmail.com
 */
public class StorageError extends BaseOperation {

    private long id;
    private String failedType;

    public long getId() {
        return id;
    }

    public StorageError setId(long commandId) {
        this.id = commandId;
        return this;
    }

    /**
     * @return the failedType
     */
    public String getFailedType() {
        return failedType;
    }

    /**
     * @param failedType the failedType to set
     */
    public StorageError setFailedType(String failedType) {
        this.failedType = failedType;
        return this;
    }
    
}
