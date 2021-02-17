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

import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;

/**
 * @author eric.wittmann@gmail.com
 */
public class CodegenJavaBean {
    
    private String _package;
    private String name;
    private JsonNode $schema;
    private String signature;
    private List<String> annotations;
    
    /**
     * Constructor.
     */
    public CodegenJavaBean() {
    }

    /**
     * @return the _package
     */
    public String getPackage() {
        return _package;
    }

    /**
     * @param _package the _package to set
     */
    public void setPackage(String _package) {
        this._package = _package;
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
     * @return the $schema
     */
    public JsonNode get$schema() {
        return $schema;
    }

    /**
     * @param $schema the $schema to set
     */
    public void set$schema(JsonNode $schema) {
        this.$schema = $schema;
    }

    /**
     * @return the signature
     */
    public String getSignature() {
        return signature;
    }

    /**
     * @param signature the signature to set
     */
    public void setSignature(String signature) {
        this.signature = signature;
    }

    /**
     * @return the annotations
     */
    public List<String> getAnnotations() {
        return annotations;
    }

    /**
     * @param annotations the annotations to set
     */
    public void setAnnotations(List<String> annotations) {
        this.annotations = annotations;
    }

}
