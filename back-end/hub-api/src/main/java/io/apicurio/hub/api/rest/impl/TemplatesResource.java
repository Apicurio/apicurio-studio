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

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;

import io.apicurio.hub.api.beans.NewApiTemplate;
import io.apicurio.hub.api.beans.UpdateApiTemplate;
import io.apicurio.hub.api.metrics.IApiMetrics;
import io.apicurio.hub.api.rest.ITemplatesResource;
import io.apicurio.hub.api.security.ISecurityContext;
import io.apicurio.hub.core.auth.impl.AuthorizationService;
import io.apicurio.hub.core.beans.ApiDesignType;
import io.apicurio.hub.core.beans.ApiTemplate;
import io.apicurio.hub.core.beans.ApiTemplateKind;
import io.apicurio.hub.core.beans.StoredApiTemplate;
import io.apicurio.hub.core.exceptions.AccessDeniedException;
import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.exceptions.ServerError;
import io.apicurio.hub.core.storage.IStorage;
import io.apicurio.hub.core.storage.StorageException;
import io.apicurio.studio.shared.beans.User;

/**
 * @author c.desc2@gmail.com
 */
public class TemplatesResource implements ITemplatesResource {

    private static Logger logger = LoggerFactory.getLogger(TemplatesResource.class);

    private static List<ApiTemplate> staticTemplates;

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
            staticTemplates = readTemplates.stream().collect(Collectors.toUnmodifiableList());
        } catch (IOException e) {
            logger.error("Could not read API templates", e);
        }
    }

    @Inject
    private IApiMetrics metrics;
    @Inject
    private IStorage storage;
    @Inject
    private ISecurityContext security;
    @Inject
    private AuthorizationService authorizationService;

    /**
     * @see ITemplatesResource#getAllTemplates(ApiDesignType, ApiTemplateKind)
     */
    @Override
    public List<ApiTemplate> getAllTemplates(ApiDesignType type, ApiTemplateKind templateKind) throws ServerError {
        metrics.apiCall("/templates/all", "GET");
        final ArrayList<ApiTemplate> apiTemplates = new ArrayList<>();
        if (templateKind == null || templateKind == ApiTemplateKind.STATIC) {
            if (type == null) {
                logger.debug("Getting all static templates");
                apiTemplates.addAll(staticTemplates);
            } else {
                logger.debug("Getting all static templates of type {}", type);
                staticTemplates.stream().filter(apiTemplate -> type.equals(apiTemplate.getType()))
                        .forEach(apiTemplates::add);
            }
        }
        if (templateKind == null || templateKind == ApiTemplateKind.STORED) {
            logger.debug("Getting all stored templates");
            apiTemplates.addAll(getStoredTemplates(type));
        }
        return apiTemplates;
    }

    private List<StoredApiTemplate> getStoredTemplates(ApiDesignType type) throws ServerError {
        logger.debug("Getting all stored templates");
        metrics.apiCall("/templates", "GET");
        try {
            if (type == null) {
                return this.storage.getStoredApiTemplates();
            }
            return this.storage.getStoredApiTemplates(type);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see ITemplatesResource#createStoredTemplate(NewApiTemplate)
     */
    @Override
    public StoredApiTemplate createStoredTemplate(NewApiTemplate template) throws ServerError, AccessDeniedException {
        logger.debug("Creating a stored template");
        metrics.apiCall("/templates", "POST");
        try {
            final User currentUser = this.security.getCurrentUser();
            if (!authorizationService.hasTemplateCreationPermission(currentUser)) {
                throw new AccessDeniedException();
            }

            StoredApiTemplate storedApiTemplate = new StoredApiTemplate();
            String templateId = UUID.randomUUID().toString();
            storedApiTemplate.setTemplateId(templateId);
            storedApiTemplate.setName(template.getName());
            storedApiTemplate.setDescription(template.getDescription());
            storedApiTemplate.setType(template.getType());
            storedApiTemplate.setOwner(currentUser.getLogin());
            storedApiTemplate.setDocument(template.getDocument());

            this.storage.createApiTemplate(storedApiTemplate);

            return storedApiTemplate;
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see ITemplatesResource#getStoredTemplate(String)
     */
    @Override
    public StoredApiTemplate getStoredTemplate(String templateId) throws ServerError, NotFoundException {
        logger.debug("Getting the stored template with ID: {}", templateId);
        metrics.apiCall("/templates/{templateId}", "GET");
        try {
            return this.storage.getStoredApiTemplate(templateId);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see ITemplatesResource#updateStoredTemplate(String, UpdateApiTemplate)
     */
    @Override
    public void updateStoredTemplate(String templateId, UpdateApiTemplate template) throws ServerError, NotFoundException, AccessDeniedException {
        logger.debug("Updating the stored template with ID: {}", templateId);
        metrics.apiCall("/templates/{templateId}", "PUT");
        try {
            final User currentUser = this.security.getCurrentUser();
            if (!authorizationService.hasTemplateCreationPermission(currentUser)) {
                throw new AccessDeniedException();
            }
            StoredApiTemplate storedApiTemplate = new StoredApiTemplate();

            storedApiTemplate.setTemplateId(templateId);
            storedApiTemplate.setName(template.getName());
            storedApiTemplate.setDescription(template.getDescription());
            storedApiTemplate.setOwner(currentUser.getLogin());
            storedApiTemplate.setDocument(template.getDocument());

            this.storage.updateApiTemplate(storedApiTemplate);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see ITemplatesResource#deleteStoredTemplate(String)
     */
    @Override
    public void deleteStoredTemplate(String templateId) throws ServerError, NotFoundException, AccessDeniedException {
        logger.debug("Deleting the stored template with ID: {}", templateId);
        metrics.apiCall("/templates/{templateId}", "DELETE");
        try {
            if (!authorizationService.hasTemplateCreationPermission(this.security.getCurrentUser())) {
                throw new AccessDeniedException();
            }
            this.storage.deleteApiTemplate(templateId);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }
}
