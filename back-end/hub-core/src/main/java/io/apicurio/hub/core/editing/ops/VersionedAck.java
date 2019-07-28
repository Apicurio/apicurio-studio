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
package io.apicurio.hub.core.editing.ops;

/**
 * Important, note this is command ID, not command.
 *
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public class VersionedAck extends VersionedOperation {
    
    private long commandId;
    private String ackType;

    public long getCommandId() {
        return commandId;
    }

    public VersionedAck setCommandId(long commandId) {
        this.commandId = commandId;
        return this;
    }

    /**
     * @return the ackType
     */
    public String getAckType() {
        return ackType;
    }

    /**
     * @param ackType the ackType to set
     */
    public VersionedAck setAckType(String ackType) {
        this.ackType = ackType;
        return this;
    }
    
}
