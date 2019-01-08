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

package io.apicurio.hub.api.microcks;

import java.util.Date;

/**
 * A Microcks importer.
 * 
 * @author laurent.broudoux@gmail.com
 */
public class MicrocksImporter {

    private String id;
    private String name;
    private String repositoryUrl;
    private boolean repositoryDisableSSLValidation = false;
    private String frequency;
    private Date createdDate;
    private Date lastImportDate;
    private String lastImportError;
    private boolean active = false;
    private String etag;

    private MicrocksSecretRef secretRef;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRepositoryUrl() {
        return repositoryUrl;
    }

    public void setRepositoryUrl(String repositoryUrl) {
        this.repositoryUrl = repositoryUrl;
    }

    public boolean isRepositoryDisableSSLValidation() {
        return repositoryDisableSSLValidation;
    }

    public void setRepositoryDisableSSLValidation(boolean repositoryDisableSSLValidation) {
        this.repositoryDisableSSLValidation = repositoryDisableSSLValidation;
    }

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Date getLastImportDate() {
        return lastImportDate;
    }

    public void setLastImportDate(Date lastImportDate) {
        this.lastImportDate = lastImportDate;
    }

    public String getLastImportError() {
        return lastImportError;
    }

    public void setLastImportError(String lastImportError) {
        this.lastImportError = lastImportError;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getEtag() {
        return etag;
    }

    public void setEtag(String etag) {
        this.etag = etag;
    }

    public MicrocksSecretRef getSecretRef() {
        return secretRef;
    }

    public void setSecretRef(MicrocksSecretRef secretRef) {
        this.secretRef = secretRef;
    }
}
