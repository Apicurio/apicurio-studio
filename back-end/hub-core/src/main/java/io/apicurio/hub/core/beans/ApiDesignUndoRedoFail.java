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
 * Used to let a user know that their attempt to undo or redo a command
 * failed.
 * @author eric.wittmann@gmail.com
 */
public class ApiDesignUndoRedoFail {
    
    private long contentVersion;
    private String reason;
    
    /**
     * Constructor.
     */
    public ApiDesignUndoRedoFail() {
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

    /**
     * @return the reason
     */
    public String getReason() {
        return reason;
    }

    /**
     * @param reason the reason to set
     */
    public void setReason(String reason) {
        this.reason = reason;
    }

}
