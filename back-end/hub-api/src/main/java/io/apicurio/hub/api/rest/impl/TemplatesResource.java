/*
 * Copyright 2021 Red Hat
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

package io.apicurio.hub.api.rest.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import io.apicurio.hub.api.rest.ITemplatesResource;
import io.apicurio.hub.core.beans.ApiDesignType;
import io.apicurio.hub.core.beans.ApiTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author c.desc2@gmail.com
 */
public class TemplatesResource implements ITemplatesResource {

    private static Logger logger = LoggerFactory.getLogger(TemplatesResource.class);

    private static List<ApiTemplate> allTemplates;

    static {
        final List<String> templateResources = List.of(
                "api-templates/openapi-2/simple.json",
                "api-templates/openapi-2/petstore.json",
                "api-templates/openapi-3/petstore.json",
                "api-templates/openapi-3/uspto.json",
                "api-templates/asyncapi-2/user-signedup.json"
        );
        final ObjectReader templateReader = new ObjectMapper().findAndRegisterModules().readerFor(ApiTemplate.class);
        final ClassLoader loader = Thread.currentThread().getContextClassLoader();
        try {
            List<ApiTemplate> readTemplates = new ArrayList<>();
            for (String templateResourcePath: templateResources) {
                final URL templateURL = loader.getResource(templateResourcePath);
                if (templateURL != null) {
                    logger.debug("Loading api template from {}", templateURL);
                    readTemplates.add(templateReader.readValue(templateURL.openStream()));
                } else {
                    logger.warn("The resource name {} does not map any existing resource", templateResourcePath);
                }
            }
            // Finalize the static inventory
            allTemplates = readTemplates.stream().collect(Collectors.toUnmodifiableList());
        } catch (IOException e) {
            logger.error("Could not read API templates", e);
        }
    }

    /**
     * @see ITemplatesResource#getAllTemplates(ApiDesignType)
     */
    @Override
    public List<ApiTemplate> getAllTemplates(ApiDesignType type) {
        if (type == null) {
            logger.info("Getting all templates");
            return allTemplates;
        } else {
            logger.info("Getting all templates of type {}", type);
            return allTemplates.stream().filter(apiTemplate -> type.equals(apiTemplate.getType())).collect(Collectors.toUnmodifiableList());
        }
    }
}
