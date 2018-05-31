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

package io.apicurio.hub.api.beans;

import java.util.Map;

import io.apicurio.hub.core.beans.CodegenProjectType;

/**
 * @author eric.wittmann@gmail.com
 */
public class NewCodegenProject {

    private CodegenProjectType projectType;
    private Map<String, String> projectConfig;
    private CodegenLocation location;
    private CodegenPublishInfo publishInfo;
    
    /**
     * Constructor.
     */
    public NewCodegenProject() {
    }

    /**
     * @return the projectType
     */
    public CodegenProjectType getProjectType() {
        return projectType;
    }

    /**
     * @param projectType the projectType to set
     */
    public void setProjectType(CodegenProjectType projectType) {
        this.projectType = projectType;
    }

    /**
     * @return the projectConfig
     */
    public Map<String, String> getProjectConfig() {
        return projectConfig;
    }

    /**
     * @param projectConfig the projectConfig to set
     */
    public void setProjectConfig(Map<String, String> projectConfig) {
        this.projectConfig = projectConfig;
    }

    /**
     * @return the location
     */
    public CodegenLocation getLocation() {
        return location;
    }

    /**
     * @param location the location to set
     */
    public void setLocation(CodegenLocation location) {
        this.location = location;
    }

    /**
     * @return the publishInfo
     */
    public CodegenPublishInfo getPublishInfo() {
        return publishInfo;
    }

    /**
     * @param publishInfo the publishInfo to set
     */
    public void setPublishInfo(CodegenPublishInfo publishInfo) {
        this.publishInfo = publishInfo;
    }

}
