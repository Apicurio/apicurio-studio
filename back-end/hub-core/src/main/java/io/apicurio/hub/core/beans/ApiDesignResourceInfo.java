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

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.fasterxml.jackson.dataformat.yaml.YAMLGenerator;

import io.apicurio.datamodels.Library;
import io.apicurio.datamodels.core.models.Document;
import io.apicurio.datamodels.core.models.DocumentType;
import io.apicurio.datamodels.core.models.common.Tag;
import io.apicurio.datamodels.openapi.v2.models.Oas20Document;
import io.apicurio.datamodels.openapi.v3.models.Oas30Document;
import io.apicurio.hub.core.exceptions.ApiValidationException;

/**
 * Represents some basic information extracted from an API Design resource (the 
 * content of an API design, typically an OpenAPI document).
 * @author eric.wittmann@gmail.com
 */
public class ApiDesignResourceInfo {

    protected static final ObjectMapper jsonMapper;
    protected static final ObjectMapper yamlMapper;
    protected static final Set<String> SUPPORTED_OPENAPI_VERSIONS = new HashSet<>();
    static {
        jsonMapper = new ObjectMapper();
        jsonMapper.setSerializationInclusion(Include.NON_NULL);
        jsonMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        YAMLFactory factory = new YAMLFactory();
        factory.enable(YAMLGenerator.Feature.MINIMIZE_QUOTES);
        yamlMapper = new ObjectMapper(factory);
        yamlMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        SUPPORTED_OPENAPI_VERSIONS.add("2.0");
        SUPPORTED_OPENAPI_VERSIONS.add("3.0.0");
        SUPPORTED_OPENAPI_VERSIONS.add("3.0.1");
        SUPPORTED_OPENAPI_VERSIONS.add("3.0.2");
    }

    public static ApiDesignResourceInfo fromContent(String content) throws Exception, ApiValidationException {
        String name = null;
        String description = null;
        FormatType format = FormatType.JSON;
        ObjectMapper mapper = jsonMapper;
        if (!content.startsWith("{")) {
            format = FormatType.YAML;
            mapper = yamlMapper;
        }
        
        JsonNode contentObj = mapper.readTree(content);
        Document document = Library.readDocument(contentObj);
        String oaiVersion = null;
        if (document.getDocumentType() == DocumentType.openapi2) {
            oaiVersion = ((Oas20Document) document).swagger;
        } else {
            oaiVersion = ((Oas30Document) document).openapi;
        }
        if (oaiVersion == null) {
            throw new ApiValidationException("Unable to determine OpenAPI version.");
        }
        if (!SUPPORTED_OPENAPI_VERSIONS.contains(oaiVersion)) {
            throw new ApiValidationException("OpenAPI version not supported: " + oaiVersion);
        }
        if (document.info != null) {
            if (document.info.title != null) {
                name = document.info.title;
            }
            if (document.info.description != null) {
                description = document.info.description;
            }
        }

        ApiDesignResourceInfo info = new ApiDesignResourceInfo();
        info.setFormat(format);
        info.setName(name);
        info.setDescription(description);
        if (document.tags != null) {
            for (Tag tag : document.tags) {
                info.getTags().add(tag.name);
            }
        }

        if (oaiVersion.startsWith("2")) {
            info.setType(ApiDesignType.OpenAPI20);
        }
        if (oaiVersion.startsWith("3")) {
            info.setType(ApiDesignType.OpenAPI30);
        }
        
        return info;
    }
    
    
    private String name;
    private String description;
    private Set<String> tags = new HashSet<>();
    private FormatType format;
    private ApiDesignType type;
    
    /**
     * Constructor.
     */
    public ApiDesignResourceInfo() {
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
     * @return the tags
     */
    public Set<String> getTags() {
        return tags;
    }

    /**
     * @param tags the tags to set
     */
    public void setTags(Set<String> tags) {
        this.tags = tags;
    }

    /**
     * @return the format
     */
    public FormatType getFormat() {
        return format;
    }

    /**
     * @param format the format to set
     */
    public void setFormat(FormatType format) {
        this.format = format;
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
