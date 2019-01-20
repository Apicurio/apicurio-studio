/*
 * Copyright 2018 JBoss Inc
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
package io.apicurio.hub.core.editing.sessionbeans;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VersionedOperation extends BaseOperation {
    private long contentVersion;

    public VersionedOperation() {}

    public long getContentVersion() {
        return contentVersion;
    }

    public VersionedOperation setContentVersion(long contentVersion) {
        this.contentVersion = contentVersion;
        return this;
    }

    public static VersionedOperation redo(long contentVersion) {
        return (VersionedOperation) new VersionedOperation()
                .setContentVersion(contentVersion)
                .setType("redo");
    }

    public static VersionedOperation undo(long contentVersion) {
        return (VersionedOperation) new VersionedOperation()
                .setContentVersion(contentVersion)
                .setType("undo");
    }
}
