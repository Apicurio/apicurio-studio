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

package io.apicurio.studio.shared.beans;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

/**
 * @author eric.wittmann@gmail.com
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
public class StudioConfigApis {
    
    private StudioConfigApisType type;
    private String hubUrl;
    private String editingUrl;
    
    /**
     * Constructor.
     */
    public StudioConfigApis() {
    }

    /**
     * @return the type
     */
    public StudioConfigApisType getType() {
        return type;
    }

    /**
     * @param type the type to set
     */
    public void setType(StudioConfigApisType type) {
        this.type = type;
    }

    /**
     * @return the hubUrl
     */
    public String getHubUrl() {
        return hubUrl;
    }

    /**
     * @param hubUrl the hubUrl to set
     */
    public void setHubUrl(String hubUrl) {
        this.hubUrl = hubUrl;
    }

    /**
     * @return the editingUrl
     */
    public String getEditingUrl() {
        return editingUrl;
    }

    /**
     * @param editingUrl the editingUrl to set
     */
    public void setEditingUrl(String editingUrl) {
        this.editingUrl = editingUrl;
    }

}
