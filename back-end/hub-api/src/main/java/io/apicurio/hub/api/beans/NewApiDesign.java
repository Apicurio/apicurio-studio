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

package io.apicurio.hub.api.beans;

import io.apicurio.hub.core.beans.ApiDesignType;

/**
 * @author eric.wittmann@gmail.com
 */
public class NewApiDesign {

    @Deprecated
    private String specVersion;
    private String name;
    private String description;
    private ApiDesignType type;
    
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
     * @return the specVersion
     */
    public String getSpecVersion() {
        return specVersion;
    }

    /**
     * @param specVersion the specVersion to set
     */
    public void setSpecVersion(String specVersion) {
        this.specVersion = specVersion;
    }

    /**
     * @return the type
     */
    public ApiDesignType getType() {
        return type;
    }

    /**
     * @param type the type to set
     */
    public void setType(ApiDesignType type) {
        this.type = type;
    }
    
}
