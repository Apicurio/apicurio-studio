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

package io.apicurio.hub.api.codegen.beans;

import java.util.ArrayList;
import java.util.List;

/**
 * @author eric.wittmann@gmail.com
 */
public class CodegenInfo {

    private String name = "Generated Thorntail API";
    private String description = "A generated Thorntail project with JAX-RS and Microprofile OpenAPI features enabled.";
    private String version = "1.0.0";
    private List<CodegenJavaInterface> interfaces = new ArrayList<>();
    private List<CodegenJavaBean> beans = new ArrayList<>();
    private String contextRoot;
    private List<String> beanAnnotations = new ArrayList<>();;
    
    /**
     * Constructor.
     */
    public CodegenInfo() {
    }

    /**
     * @return the interfaces
     */
    public List<CodegenJavaInterface> getInterfaces() {
        return interfaces;
    }

    /**
     * @param interfaces the interfaces to set
     */
    public void setInterfaces(List<CodegenJavaInterface> interfaces) {
        this.interfaces = interfaces;
    }

    /**
     * @return the beans
     */
    public List<CodegenJavaBean> getBeans() {
        return beans;
    }

    /**
     * @param beans the beans to set
     */
    public void setBeans(List<CodegenJavaBean> beans) {
        this.beans = beans;
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
     * @return the version
     */
    public String getVersion() {
        return version;
    }

    /**
     * @param version the version to set
     */
    public void setVersion(String version) {
        this.version = version;
    }

    /**
     * @return the contextRoot
     */
    public String getContextRoot() {
        return contextRoot;
    }

    /**
     * @param contextRoot the contextRoot to set
     */
    public void setContextRoot(String contextRoot) {
        this.contextRoot = contextRoot;
    }

    /**
     * @return the beanAnnotations
     */
    public List<String> getBeanAnnotations() {
        return beanAnnotations;
    }

    /**
     * @param beanAnnotations the beanAnnotations to set
     */
    public void setBeanAnnotations(List<String> beanAnnotations) {
        this.beanAnnotations = beanAnnotations;
    }
    
}
