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

import java.util.Date;

/**
 * @author c.desc2@gmail.com
 */
public class ApiTemplatePublication {

    private String designId;
    private String name;
    private String description;
    private long contentVersion;
    private String createdBy;
    private Date createdOn;
    
    /**
     * Constructor.
     */
    public ApiTemplatePublication() {
    }

    public ApiTemplatePublication(String designId, String name, String description, long contentVersion, String createdBy, Date createdOn) {
        this.designId = designId;
        this.name = name;
        this.description = description;
        this.contentVersion = contentVersion;
        this.createdBy = createdBy;
        this.createdOn = createdOn;
    }

    /**
     * @return the designId
     */
    public String getDesignId() {
        return designId;
    }

    /**
     * @param designId the designId to set
     */
    public void setDesignId(String designId) {
        this.designId = designId;
    }

    /**
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return the description
     */
    public String getDescription() {
        return description;
    }

    /**
     * @param description the description to set
     */
    public void setDescription(String description) {
        this.description = description;
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
     * @return the createdBy
     */
    public String getCreatedBy() {
        return createdBy;
    }

    /**
     * @param createdBy the createdBy to set
     */
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    /**
     * @return the createdOn
     */
    public Date getCreatedOn() {
        return createdOn;
    }

    /**
     * @param createdOn the createdOn to set
     */
    public void setCreatedOn(Date createdOn) {
        this.createdOn = createdOn;
    }
}
