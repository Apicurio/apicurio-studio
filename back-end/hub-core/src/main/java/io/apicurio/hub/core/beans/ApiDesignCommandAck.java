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

package io.apicurio.hub.core.beans;

/**
 * Represents an acknowledgement from the server that a command was received
 * and persisted.  This message is sent only to the client that originated the
 * command.  It basically tells the client that its command was received and
 * tells it (the client) what the command's final content version is.
 * @author eric.wittmann@gmail.com
 */
public class ApiDesignCommandAck {
    
    private long commandId;
    private long contentVersion;
    
    /**
     * Constructor.
     */
    public ApiDesignCommandAck() {
    }

    /**
     * @return the commandId
     */
    public long getCommandId() {
        return commandId;
    }

    /**
     * @param commandId the commandId to set
     */
    public void setCommandId(long commandId) {
        this.commandId = commandId;
    }

    /**
     * @return the contentVersion
     */
    public long getContentVersion() {
        return contentVersion;
    }

    /**
     * @param contentVersion the contentVersion to set
     */
    public void setContentVersion(long contentVersion) {
        this.contentVersion = contentVersion;
    }

}
