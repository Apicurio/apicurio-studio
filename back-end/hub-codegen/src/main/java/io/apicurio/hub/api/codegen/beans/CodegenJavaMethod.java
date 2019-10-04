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
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * @author eric.wittmann@gmail.com
 */
public class CodegenJavaMethod {

    private String name;
    private String description;
    private String path;
    private String method;
    private Set<String> produces = new HashSet<>();
    private Set<String> consumes = new HashSet<>();
    private List<CodegenJavaArgument> arguments = new ArrayList<>();
    private CodegenJavaReturn _return;
    private boolean async;
    
    /**
     * Constructor.
     */
    public CodegenJavaMethod() {
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
     * @return the path
     */
    public String getPath() {
        return path;
    }

    /**
     * @param path the path to set
     */
    public void setPath(String path) {
        this.path = path;
    }

    /**
     * @return the method
     */
    public String getMethod() {
        return method;
    }

    /**
     * @param method the method to set
     */
    public void setMethod(String method) {
        this.method = method;
    }

    /**
     * @return the produces
     */
    public Set<String> getProduces() {
        return produces;
    }

    /**
     * @param produces the produces to set
     */
    public void setProduces(Set<String> produces) {
        this.produces = produces;
    }

    /**
     * @return the consumes
     */
    public Set<String> getConsumes() {
        return consumes;
    }

    /**
     * @param consumes the consumes to set
     */
    public void setConsumes(Set<String> consumes) {
        this.consumes = consumes;
    }

    /**
     * @return the arguments
     */
    public List<CodegenJavaArgument> getArguments() {
        return arguments;
    }

    /**
     * @param arguments the arguments to set
     */
    public void setArguments(List<CodegenJavaArgument> arguments) {
        this.arguments = arguments;
    }

    /**
     * @return the _return
     */
    public CodegenJavaReturn getReturn() {
        return _return;
    }

    /**
     * @param _return the _return to set
     */
    public void setReturn(CodegenJavaReturn _return) {
        this._return = _return;
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
     * @return the async
     */
    public boolean isAsync() {
        return async;
    }

    /**
     * @param async the async to set
     */
    public void setAsync(boolean async) {
        this.async = async;
    }
    
}
