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

import graphql.schema.idl.SchemaParser;
import graphql.schema.idl.TypeDefinitionRegistry;
import io.apicurio.datamodels.Library;
import io.apicurio.datamodels.core.models.Document;
import io.apicurio.datamodels.core.models.DocumentType;
import io.apicurio.datamodels.core.models.common.Tag;
import io.apicurio.hub.core.exceptions.ApiValidationException;

/**
 * Represents some basic information extracted from an API Design resource (the 
 * content of an API design, typically an OpenAPI or AsyncAPI document).  If the
 * information cannot be determined from the source (e.g. a GraphQL document) then
 * some information is generated instead.
 * @author eric.wittmann@gmail.com
 */
public class ApiDesignResourceInfo {

    protected static final ObjectMapper jsonMapper;
    protected static final ObjectMapper yamlMapper;
    static {
        jsonMapper = new ObjectMapper();
        jsonMapper.setSerializationInclusion(Include.NON_NULL);
        jsonMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        YAMLFactory factory = new YAMLFactory();
        factory.enable(YAMLGenerator.Feature.MINIMIZE_QUOTES);
        yamlMapper = new ObjectMapper(factory);
        yamlMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    public static ApiDesignResourceInfo fromContent(String content) throws Exception, ApiValidationException {
        ApiDesignResourceInfo info = fromDataModelContent(content);
        if (info == null) {
            info = fromGraphQLContent(content);
        }
        return info;
    }
    
    public static ApiDesignResourceInfo fromDataModelContent(String content) throws Exception, ApiValidationException {
        try {
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
    
            if (document.getDocumentType() == DocumentType.openapi2) {
                info.setType(ApiDesignType.OpenAPI20);
            } else if (document.getDocumentType() == DocumentType.openapi3) {
                info.setType(ApiDesignType.OpenAPI30);
            } else if (document.getDocumentType() == DocumentType.asyncapi2) {
                info.setType(ApiDesignType.AsyncAPI20);
            }
    
            return info;
        } catch (Exception e) {
        }
        return null;
    }

    private static ApiDesignResourceInfo fromGraphQLContent(String content) {
        try {
            SchemaParser schemaParser = new SchemaParser();
            TypeDefinitionRegistry typeDefinitionRegistry = schemaParser.parse(content);
            int numTypes = typeDefinitionRegistry.types().size();
            ApiDesignResourceInfo info = new ApiDesignResourceInfo();
            info.setFormat(FormatType.SDL);
            info.setName("Imported GraphQL Schema");
            String typeList = String.join(", ", typeDefinitionRegistry.types().keySet());
            info.setDescription("An imported GraphQL schema with the following " + numTypes + " types: " + typeList);
            info.setType(ApiDesignType.GraphQL);
            return info;
        } catch (Exception e) {
        }
        return null;
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
