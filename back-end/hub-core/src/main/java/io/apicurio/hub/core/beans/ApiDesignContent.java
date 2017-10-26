/*
 * Copyright 2017 JBoss Inc
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
 * @author eric.wittmann@gmail.com
 */
public class ApiDesignContent {

    private String oaiDocument;
    private long contentVersion;
    
    /**
     * Constructor.
     */
    public ApiDesignContent() {
    }

    /**
     * @return the oaiDocument
     */
    public String getOaiDocument() {
        return oaiDocument;
    }

    /**
     * @param oaiDocument the oaiDocument to set
     */
    public void setOaiDocument(String oaiDocument) {
        this.oaiDocument = oaiDocument;
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
