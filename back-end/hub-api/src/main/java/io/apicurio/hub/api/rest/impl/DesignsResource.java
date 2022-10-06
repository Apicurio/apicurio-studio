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

package io.apicurio.hub.api.rest.impl;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.zip.ZipInputStream;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.StreamingOutput;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;

import graphql.schema.idl.SchemaParser;
import io.apicurio.datamodels.Library;
import io.apicurio.datamodels.core.models.Document;
import io.apicurio.datamodels.core.models.DocumentType;
import io.apicurio.datamodels.core.models.ValidationProblem;
import io.apicurio.datamodels.core.models.ValidationProblemSeverity;
import io.apicurio.datamodels.core.validation.IValidationSeverityRegistry;
import io.apicurio.datamodels.core.validation.ValidationRuleMetaData;
import io.apicurio.hub.api.beans.CodegenLocation;
import io.apicurio.hub.api.beans.ImportApiDesign;
import io.apicurio.hub.api.beans.NewApiDesign;
import io.apicurio.hub.api.beans.NewApiPublication;
import io.apicurio.hub.api.beans.NewApiTemplate;
import io.apicurio.hub.api.beans.NewCodegenProject;
import io.apicurio.hub.api.beans.ResourceContent;
import io.apicurio.hub.api.beans.UpdateCodgenProject;
import io.apicurio.hub.api.beans.UpdateCollaborator;
import io.apicurio.hub.api.beans.ValidationError;
import io.apicurio.hub.api.bitbucket.BitbucketResourceResolver;
import io.apicurio.hub.api.codegen.JaxRsProjectSettings;
import io.apicurio.hub.api.codegen.OpenApi2JaxRs;
import io.apicurio.hub.api.codegen.OpenApi2Quarkus;
import io.apicurio.hub.api.codegen.OpenApi2Thorntail;
import io.apicurio.hub.api.connectors.ISourceConnector;
import io.apicurio.hub.api.connectors.SourceConnectorException;
import io.apicurio.hub.api.connectors.SourceConnectorFactory;
import io.apicurio.hub.api.content.ContentDereferencer;
import io.apicurio.hub.api.github.GitHubResourceResolver;
import io.apicurio.hub.api.gitlab.GitLabResourceResolver;
import io.apicurio.hub.api.metrics.IApiMetrics;
import io.apicurio.hub.api.microcks.IMicrocksConnector;
import io.apicurio.hub.api.microcks.MicrocksConnectorException;
import io.apicurio.hub.api.rest.IDesignsResource;
import io.apicurio.hub.api.security.ISecurityContext;
import io.apicurio.hub.core.auth.impl.AuthorizationService;
import io.apicurio.hub.core.beans.ApiContentType;
import io.apicurio.hub.core.beans.ApiDesign;
import io.apicurio.hub.core.beans.ApiDesignChange;
import io.apicurio.hub.core.beans.ApiDesignCollaborator;
import io.apicurio.hub.core.beans.ApiDesignCommand;
import io.apicurio.hub.core.beans.ApiDesignContent;
import io.apicurio.hub.core.beans.ApiDesignResourceInfo;
import io.apicurio.hub.core.beans.ApiDesignType;
import io.apicurio.hub.core.beans.ApiMock;
import io.apicurio.hub.core.beans.ApiPublication;
import io.apicurio.hub.core.beans.ApiTemplatePublication;
import io.apicurio.hub.core.beans.CodegenProject;
import io.apicurio.hub.core.beans.CodegenProjectType;
import io.apicurio.hub.core.beans.Contributor;
import io.apicurio.hub.core.beans.DereferenceControlResult;
import io.apicurio.hub.core.beans.FormatType;
import io.apicurio.hub.core.beans.Invitation;
import io.apicurio.hub.core.beans.LinkedAccountType;
import io.apicurio.hub.core.beans.MockReference;
import io.apicurio.hub.core.beans.SharingConfiguration;
import io.apicurio.hub.core.beans.SharingLevel;
import io.apicurio.hub.core.beans.StoredApiTemplate;
import io.apicurio.hub.core.beans.UpdateSharingConfiguration;
import io.apicurio.hub.core.cmd.OaiCommandException;
import io.apicurio.hub.core.cmd.OaiCommandExecutor;
import io.apicurio.hub.core.config.HubConfiguration;
import io.apicurio.hub.core.content.ContentAccessibilityAsserter;
import io.apicurio.hub.core.editing.IEditingSessionManager;
import io.apicurio.hub.core.exceptions.AccessDeniedException;
import io.apicurio.hub.core.exceptions.ApiValidationException;
import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.exceptions.ServerError;
import io.apicurio.hub.core.exceptions.UnresolvableReferenceException;
import io.apicurio.hub.core.integrations.ApicurioEventType;
import io.apicurio.hub.core.integrations.EventsService;
import io.apicurio.hub.core.storage.IStorage;
import io.apicurio.hub.core.storage.StorageException;
import io.apicurio.hub.core.util.FormatUtils;
import io.apicurio.studio.shared.beans.User;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class DesignsResource implements IDesignsResource {

    private static Logger logger = LoggerFactory.getLogger(DesignsResource.class);
    private static ObjectMapper mapper = new ObjectMapper();
    static {
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        mapper.setSerializationInclusion(Include.NON_NULL);
    }

    @Inject
    private HubConfiguration config;
    @Inject
    private IStorage storage;
    @Inject
    private SourceConnectorFactory sourceConnectorFactory;
    @Inject
    private ISecurityContext security;
    @Inject
    private IApiMetrics metrics;
    @Inject
    private OaiCommandExecutor oaiCommandExecutor;
    @Inject
    private ContentDereferencer dereferencer;
    @Inject
    private ContentAccessibilityAsserter accessibilityAsserter;
    @Inject
    private IEditingSessionManager editingSessionManager;
    @Inject
    private IMicrocksConnector microcks;

    @Context
    private HttpServletRequest request;
    @Context
    private HttpServletResponse response;

    @Inject
    private GitLabResourceResolver gitLabResolver;
    @Inject
    private GitHubResourceResolver gitHubResolver;
    @Inject
    private BitbucketResourceResolver bitbucketResolver;

    @Inject
    private EventsService eventsService;
    @Inject
    private AuthorizationService authorizationService;

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#listDesigns()
     */
    @Override
    public Collection<ApiDesign> listDesigns() throws ServerError {
        metrics.apiCall("/designs", "GET");

        try {
            logger.debug("Listing API Designs");
            String user = this.security.getCurrentUser().getLogin();
            Collection<ApiDesign> designs = this.storage.listApiDesigns(user);
            return designs;
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#importDesign(io.apicurio.hub.api.beans.ImportApiDesign)
     */
    @Override
    public ApiDesign importDesign(ImportApiDesign info) throws ServerError, NotFoundException, ApiValidationException {
        metrics.apiCall("/designs", "PUT");

        if (info.getData() != null && !info.getData().trim().isEmpty()) {
            logger.debug("Importing an API Design (from data).");
            return importDesignFromData(info);
        } else {
            logger.debug("Importing an API Design: {}", info.getUrl());
            if (info.getUrl() == null) {
                throw new ApiValidationException("No data provided to import.");
            }
            ISourceConnector connector = null;

            try {
                connector = this.sourceConnectorFactory.createConnector(info.getUrl());
            } catch (NotFoundException nfe) {
                // This means it's not a source control URL.  So we'll treat it as a raw content URL.
                connector = null;
            }

            if (connector != null) {
                return importDesignFromSource(info, connector);
            } else {
                return importDesignFromUrl(info);
            }
        }
    }

    /**
     * Imports an API Design from one of the source control systems using its API.
     * @param info
     * @param connector
     * @throws NotFoundException
     * @throws ServerError
     * @throws ApiValidationException
     */
    private ApiDesign importDesignFromSource(ImportApiDesign info, ISourceConnector connector) throws NotFoundException, ServerError, ApiValidationException {
        try {
            ApiDesignResourceInfo resourceInfo = connector.validateResourceExists(info.getUrl());
            ResourceContent initialApiContent = connector.getResourceContent(info.getUrl());

            ApiDesign design = doImport(resourceInfo, initialApiContent.getContent());

            metrics.apiImport(connector.getType());

            return design;
        } catch (SourceConnectorException | IOException e) {
            throw new ServerError(e);
        }
    }

    /**
     * Imports an API Design from base64 encoded content included in the request.  This supports
     * the use-case where the UI allows the user to simply copy/paste the full API content.
     * @param info
     * @throws ServerError
     */
    private ApiDesign importDesignFromData(ImportApiDesign info) throws ServerError, ApiValidationException {
        try {
            String data = info.getData();
            byte[] decodedData = Base64.decodeBase64(data);

            try (InputStream is = new ByteArrayInputStream(decodedData)) {
                String content = IOUtils.toString(is, "UTF-8");
                ApiDesignResourceInfo resourceInfo = ApiDesignResourceInfo.fromContent(content);

                if (resourceInfo == null) {
                    throw new ApiValidationException("Failed to determine API Design type from content.");
                }

                ApiDesign design = doImport(resourceInfo, content);

                metrics.apiImport(null);

                return design;
            }
        } catch (ApiValidationException | ServerError e) {
            throw e;
        } catch (Exception e) {
            throw new ServerError(e);
        }
    }

    /**
     * Imports an API design from an arbitrary URL.  This simply opens a connection to that
     * URL and tries to consume its content as an OpenAPI document.
     * @param info
     * @throws NotFoundException
     * @throws ServerError
     * @throws ApiValidationException
     */
    private ApiDesign importDesignFromUrl(ImportApiDesign info) throws NotFoundException, ServerError, ApiValidationException {
        try {
            URL url = new URL(info.getUrl());

            try (InputStream is = url.openStream()) {
                String content = IOUtils.toString(is, "UTF-8");
                ApiDesignResourceInfo resourceInfo = ApiDesignResourceInfo.fromContent(content);

                String name = resourceInfo.getName();
                if (name == null) {
                    name = url.getPath();
                    if (name != null && name.indexOf("/") >= 0) {
                        name = name.substring(name.indexOf("/") + 1);
                    }
                }

                resourceInfo.setName(name);

                ApiDesign design = doImport(resourceInfo, content);

                metrics.apiImport(null);

                return design;
            }
        } catch (ApiValidationException | ServerError e) {
            throw e;
        } catch (Exception e) {
            throw new ServerError(e);
        }
    }

    /**
     * Common functionality when importing a design.
     * @param info
     * @param content
     * @throws NotFoundException
     * @throws ServerError
     * @throws ApiValidationException
     */
    private ApiDesign doImport(ApiDesignResourceInfo info, String content) throws ServerError, IOException {
        Date now = new Date();
        String user = this.security.getCurrentUser().getLogin();

        if (info.getName() == null) {
            info.setName("Imported API Design");
        }
        if (info.getDescription() == null) {
            info.setDescription("");
        }

        ApiDesign design = new ApiDesign();
        design.setName(info.getName());
        design.setDescription(info.getDescription());
        design.setCreatedBy(user);
        design.setCreatedOn(now);
        design.setTags(info.getTags());
        design.setType(info.getType());

        try {
            // Convert from YAML to JSON if the source is YAML (always store as JSON).  Only for non-GraphQL designs.
            if (info.getType() != ApiDesignType.GraphQL && info.getFormat() == FormatType.YAML) {
                content = FormatUtils.yamlToJson(content);
            }
            String id = this.storage.createApiDesign(user, design, content);
            design.setId(id);
        } catch (StorageException e) {
            throw new ServerError(e);
        }

        eventsService.triggerEvent(ApicurioEventType.DESIGN_CREATED, design);

        return design;
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#createDesign(io.apicurio.hub.api.beans.NewApiDesign)
     */
    @Override
    public ApiDesign createDesign(NewApiDesign info) throws ServerError {
        logger.debug("Creating an API Design: {}", info.getName());
        metrics.apiCall("/designs", "POST");

        try {
            Date now = new Date();
            String user = this.security.getCurrentUser().getLogin();

            // The API Design meta-data
            ApiDesign design = new ApiDesign();
            design.setName(info.getName());
            design.setDescription(info.getDescription());
            design.setCreatedBy(user);
            design.setCreatedOn(now);

            // The API Design content
            ApiDesignType type;
            if (info.getType() != null) {
                type = info.getType();
            } else {
                if (info.getSpecVersion() == null || info.getSpecVersion().equals("2.0")) {
                    type = ApiDesignType.OpenAPI20;
                } else {
                    type = ApiDesignType.OpenAPI30;
                }
            }
            design.setType(type);

            String content = createNewDocument(type, info.getName(), info.getDescription());

            // Create the API Design in the database
            String designId = storage.createApiDesign(user, design, content);
            design.setId(designId);

            metrics.apiCreate(type);

            eventsService.triggerEvent(ApicurioEventType.DESIGN_CREATED, design);

            return design;
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * Creates a new document.
     * @param type
     * @param name
     * @param description
     */
    private String createNewDocument(ApiDesignType type, String name, String description) {
        Document doc = null;
        switch (type) {
            case AsyncAPI20:
                doc = Library.createDocument(DocumentType.asyncapi2);
                break;
            case OpenAPI20:
                doc = Library.createDocument(DocumentType.openapi2);
                break;
            case OpenAPI30:
                doc = Library.createDocument(DocumentType.openapi3);
                break;
            case GraphQL:
                return "# GraphQL Schema '" + name + "' created " + new Date();
        }

        if (doc != null) {
            doc.info = doc.createInfo();
            doc.info.title = name;
            doc.info.description = description;
            doc.info.version = "1.0.0";
            return Library.writeDocumentToJSONString(doc);
        }

        throw new RuntimeException("Unhandled API design type: " + type);
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#getDesign(java.lang.String)
     */
    @Override
    public ApiDesign getDesign(String designId) throws ServerError, NotFoundException {
        logger.debug("Getting an API design with ID {}", designId);
        metrics.apiCall("/designs/{designId}", "GET");

        try {
            String user = this.security.getCurrentUser().getLogin();
            ApiDesign design = this.storage.getApiDesign(user, designId);
            return design;
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#updateDesign(java.lang.String, java.io.InputStream)
     */
    @Override
    public void updateDesign(String designId, InputStream content)
            throws ServerError, NotFoundException, ApiValidationException {
        logger.debug("Updating an API design with ID {}", designId);
        metrics.apiCall("/designs/{designId}", "PUT");

        try {
            String user = this.security.getCurrentUser().getLogin();
            ApiDesign design = this.storage.getApiDesign(user, designId);

            String encoding = "UTF8";
            if (request != null) {
                encoding = request.getCharacterEncoding();
            }
            String contentStr = IOUtils.toString(content, encoding);

            try {
                if (design.getType() == ApiDesignType.GraphQL) {
                    SchemaParser schemaParser = new SchemaParser();
                    schemaParser.parse(contentStr);
                } else {
                    Document doc = Library.readDocumentFromJSONString(contentStr);
                    switch (design.getType()) {
                        case AsyncAPI20:
                            if (doc.getDocumentType() != DocumentType.asyncapi2) {
                                throw new Exception("Expected AsyncAPI 2 content.");
                            }
                            break;
                        case OpenAPI20:
                            if (doc.getDocumentType() != DocumentType.openapi2) {
                                throw new Exception("Expected OpenAPI 2 content.");
                            }
                            break;
                        case OpenAPI30:
                            if (doc.getDocumentType() != DocumentType.openapi3) {
                                throw new Exception("Expected OpenAPI 3 content.");
                            }
                            break;
                        default:
                            break;
                    }
                }
            } catch (Exception e) {
                throw new ApiValidationException("Content is invalid.", e);
            }

            storage.addContent(user, designId, ApiContentType.Document, contentStr);
        } catch (IOException | StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#editDesign(java.lang.String)
     */
    @Override
    public Response editDesign(String designId) throws ServerError, NotFoundException {
        logger.debug("Editing an API Design with ID {}", designId);
        metrics.apiCall("/designs/{designId}/session", "GET");

        try {
            String user = this.security.getCurrentUser().getLogin();
            logger.debug("\tUSER: {}", user);

            ApiDesignContent designContent = this.storage.getLatestContentDocument(user, designId);
            String content = designContent.getDocument();
            long contentVersion = designContent.getContentVersion();
            String secret = this.security.getToken().substring(0, Math.min(64, this.security.getToken().length() - 1));
            String sessionId = this.editingSessionManager.createSessionUuid(designId, user, secret, contentVersion);

            logger.debug("\tCreated Session ID: {}", sessionId);
            logger.debug("\t            Secret: {}", secret);

            byte[] bytes = content.getBytes(StandardCharsets.UTF_8);
            String ct = "application/json; charset=" + StandardCharsets.UTF_8;
            String cl = String.valueOf(bytes.length);

            ResponseBuilder builder = Response.ok().entity(content)
                    .header("X-Apicurio-EditingSessionUuid", sessionId)
                    .header("X-Apicurio-ContentVersion", contentVersion)
                    .header("Content-Type", ct)
                    .header("Content-Length", cl);

            return builder.build();
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#deleteDesign(java.lang.String)
     */
    @Override
    public void deleteDesign(String designId) throws ServerError, NotFoundException {
        logger.debug("Deleting an API Design with ID {}", designId);
        metrics.apiCall("/designs/{designId}", "DELETE");

        try {
            String user = this.security.getCurrentUser().getLogin();
            this.storage.deleteApiDesign(user, designId);
            Map<String, String> data = new HashMap<>();
            data.put("id", designId);
            data.put("deletedBy", user);
            eventsService.triggerEvent(ApicurioEventType.DESIGN_DELETED, data);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#getContributors(java.lang.String)
     */
    @Override
    public Collection<Contributor> getContributors(String designId) throws ServerError, NotFoundException {
        logger.debug("Retrieving contributors list for design with ID: {}", designId);
        metrics.apiCall("/designs/{designId}/contributors", "GET");

        try {
            String user = this.security.getCurrentUser().getLogin();
            return this.storage.listContributors(user, designId);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#getContent(java.lang.String, java.lang.String, java.lang.String)
     */
    @Override
    public Response getContent(String designId, String format, String dereference)
            throws ServerError, NotFoundException {
        logger.debug("Getting content for API design with ID: {}", designId);
        metrics.apiCall("/designs/{designId}/content", "GET");

        try {
            FormatType formatType = format == null
                    ? null
                    : FormatType.valueOf(format.toUpperCase(Locale.ROOT));
            final boolean isDereference = "true".equalsIgnoreCase(dereference);
            getApiContent(designId, formatType, isDereference);

            String user = this.security.getCurrentUser().getLogin();

            String content = getApiContent(designId, formatType, isDereference);
            String ct = null;

            ApiDesign apiDesign = this.storage.getApiDesign(user, designId);
            if (apiDesign.getType() == ApiDesignType.GraphQL) {
                if (formatType == FormatType.JSON) {
                    // TODO: Convert from SDL to JSON
                    throw new ServerError("Format 'JSON' not yet supported for GraphQL designs.");
                }
                ct = "application/graphql; charset=" + StandardCharsets.UTF_8;
            } else if (formatType == FormatType.YAML) {
                // Convert to yaml if necessary
                ct = "application/x-yaml; charset=" + StandardCharsets.UTF_8;
            } else {
                ct = "application/json; charset=" + StandardCharsets.UTF_8;
            }

            byte[] bytes = content.getBytes(StandardCharsets.UTF_8);
            String cl = String.valueOf(bytes.length);
            ResponseBuilder builder = Response.ok().entity(content)
                    .header("Content-Type", ct)
                    .header("Content-Length", cl);
            return builder.build();
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#createInvitation(java.lang.String)
     */
    @Override
    public Invitation createInvitation(String designId) throws ServerError, NotFoundException, AccessDeniedException {
        logger.debug("Creating a collaboration invitation for API: {} ", designId);
        metrics.apiCall("/designs/{designId}/invitations", "POST");

        try {
            final User currentUser = this.security.getCurrentUser();
            String userLogin = currentUser.getLogin();
            String username = currentUser.getName();
            String inviteId = UUID.randomUUID().toString();

            ApiDesign design = this.storage.getApiDesign(userLogin, designId);
            if (!this.authorizationService.hasOwnerPermission(currentUser, designId)) {
                throw new AccessDeniedException();
            }

            this.storage.createCollaborationInvite(inviteId, designId, userLogin, username, "collaborator", design.getName());
            Invitation invite = new Invitation();
            invite.setCreatedBy(userLogin);
            invite.setCreatedOn(new Date());
            invite.setDesignId(designId);
            invite.setInviteId(inviteId);
            invite.setStatus("pending");
            return invite;
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#getInvitation(java.lang.String, java.lang.String)
     */
    @Override
    public Invitation getInvitation(String designId, String inviteId) throws ServerError, NotFoundException {
        logger.debug("Retrieving a collaboration invitation for API: {}  and inviteID: {}", designId, inviteId);
        metrics.apiCall("/designs/{designId}/invitations/{inviteId}", "GET");

        try {
            return this.storage.getCollaborationInvite(designId, inviteId);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#getInvitations(java.lang.String)
     */
    @Override
    public Collection<Invitation> getInvitations(String designId) throws ServerError, NotFoundException {
        logger.debug("Retrieving all collaboration invitations for API: {}", designId);
        metrics.apiCall("/designs/{designId}/invitations", "GET");

        try {
            String user = this.security.getCurrentUser().getLogin();
            return this.storage.listCollaborationInvites(designId, user);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#acceptInvitation(java.lang.String, java.lang.String)
     */
    @Override
    public void acceptInvitation(String designId, String inviteId) throws ServerError, NotFoundException {
        logger.debug("Accepting an invitation to collaborate on an API: {}", designId);
        metrics.apiCall("/designs/{designId}/invitations", "PUT");

        try {
            final User currentUser = this.security.getCurrentUser();
            String userLogin = currentUser.getLogin();
            Invitation invite = this.storage.getCollaborationInvite(designId, inviteId);
            if (this.authorizationService.hasPersonalWritePermission(currentUser, designId)) {
                throw new NotFoundException();
            }
            boolean accepted = this.storage.updateCollaborationInviteStatus(inviteId, "pending", "accepted", userLogin);
            if (!accepted) {
                throw new NotFoundException();
            }
            this.storage.createPermission(designId, userLogin, invite.getRole());
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#rejectInvitation(java.lang.String, java.lang.String)
     */
    @Override
    public void rejectInvitation(String designId, String inviteId) throws ServerError, NotFoundException {
        logger.debug("Rejecting an invitation to collaborate on an API: {}", designId);
        metrics.apiCall("/designs/{designId}/invitations", "DELETE");

        try {
            String user = this.security.getCurrentUser().getLogin();
            // This will ensure that the invitation exists for this designId.
            this.storage.getCollaborationInvite(designId, inviteId);
            boolean accepted = this.storage.updateCollaborationInviteStatus(inviteId, "pending", "rejected", user);
            if (!accepted) {
                throw new NotFoundException();
            }
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#getCollaborators(java.lang.String)
     */
    @Override
    public Collection<ApiDesignCollaborator> getCollaborators(String designId) throws ServerError, NotFoundException {
        logger.debug("Retrieving all collaborators for API: {}", designId);
        metrics.apiCall("/designs/{designId}/collaborators", "GET");

        try {
            final User currentUser = this.security.getCurrentUser();
            if (!this.authorizationService.hasWritePermission(currentUser, designId)) {
                throw new NotFoundException();
            }
            return this.storage.listPermissions(designId);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#updateCollaborator(java.lang.String, java.lang.String, io.apicurio.hub.api.beans.UpdateCollaborator)
     */
    @Override
    public void updateCollaborator(String designId, String userId,
            UpdateCollaborator update) throws ServerError, NotFoundException, AccessDeniedException {
        logger.debug("Updating collaborator for API: {}", designId);
        metrics.apiCall("/designs/{designId}/collaborators/{userId}", "PUT");

        try {
            final User currentUser = this.security.getCurrentUser();
            if (!this.authorizationService.hasOwnerPermission(currentUser, designId)) {
                throw new AccessDeniedException();
            }
            this.storage.updatePermission(designId, userId, update.getNewRole());
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#deleteCollaborator(java.lang.String, java.lang.String)
     */
    @Override
    public void deleteCollaborator(String designId, String userId)
            throws ServerError, NotFoundException, AccessDeniedException {
        logger.debug("Deleting/revoking collaborator for API: {}", designId);
        metrics.apiCall("/designs/{designId}/collaborators/{userId}", "DELETE");

        try {
            final User currentUser = this.security.getCurrentUser();
            if (!this.authorizationService.hasOwnerPermission(currentUser, designId)) {
                throw new AccessDeniedException();
            }
            this.storage.deletePermission(designId, userId);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#getActivity(java.lang.String, java.lang.Integer, java.lang.Integer)
     */
    @Override
    public Collection<ApiDesignChange> getActivity(String designId, Integer start, Integer end)
            throws ServerError, NotFoundException {
        int from = 0;
        int to = 20;
        if (start != null) {
            from = start.intValue();
        }
        if (end != null) {
            to = end.intValue();
        }

        try {
            final User currentUser = this.security.getCurrentUser();
            if (!this.authorizationService.hasWritePermission(currentUser, designId)) {
	                throw new NotFoundException();
        	}
            return this.storage.listApiDesignActivity(designId, from, to);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#getPublications(java.lang.String, java.lang.Integer, java.lang.Integer)
     */
    @Override
    public Collection<ApiPublication> getPublications(String designId, Integer start, Integer end)
            throws ServerError, NotFoundException {
        int from = 0;
        int to = 20;
        if (start != null) {
            from = start.intValue();
        }
        if (end != null) {
            to = end.intValue();
        }

        try {
            final User currentUser = this.security.getCurrentUser();
            if (!this.authorizationService.hasWritePermission(currentUser, designId)) {
                throw new NotFoundException();
            }
            return this.storage.listApiDesignPublicationsBy(designId, currentUser.getLogin(), from, to);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#publishApi(java.lang.String, io.apicurio.hub.api.beans.NewApiPublication, java.lang.String)
     */
    @Override
    public void publishApi(String designId, NewApiPublication info, String dereference) throws ServerError, NotFoundException {
        LinkedAccountType type = info.getType();

        try {
            // First step - publish the content to the soruce control system
            ISourceConnector connector = this.sourceConnectorFactory.createConnector(type);
            String resourceUrl = toResourceUrl(info);
            String formattedContent = getApiContent(designId, info.getFormat(), "true".equalsIgnoreCase(dereference));
            try {
                ResourceContent content = connector.getResourceContent(resourceUrl);
                content.setContent(formattedContent);
                connector.updateResourceContent(resourceUrl, info.getCommitMessage(), null, content);
            } catch (NotFoundException nfe) {
                connector.createResourceContent(resourceUrl, info.getCommitMessage(), formattedContent);
            }

            // Followup step - store a row in the api_content table
            try {
                String user = this.security.getCurrentUser().getLogin();
                String publicationData = createPublicationData(info);
                storage.addContent(user, designId, ApiContentType.Publish, publicationData);
            } catch (Exception e) {
                logger.error("Failed to record API publication in database.", e);
            }
        } catch (SourceConnectorException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#mockApi(java.lang.String)
     */
    @Override
    public MockReference mockApi(String designId) throws ServerError, NotFoundException {
        try {
            // First step - publish the content to the Microcks server API
            // TODO should dereference be fetched from query here?
            String content = getApiContent(designId, FormatType.YAML, true);
            String serviceRef = this.microcks.uploadResourceContent(content);

            // Build mockURL from microcksURL.
            String mockURL = null;
            String microcksURL = config.getMicrocksApiUrl();
            try {
                mockURL = microcksURL.substring(0, microcksURL.lastIndexOf("/api")) + "/#/services/"
                      + URLEncoder.encode(serviceRef, "UTF-8");
            } catch (Exception e) {
                logger.error("Failed to produce a valid mockURL", e);
            }

            // Followup step - store a row in the api_content table
            try {
                String user = this.security.getCurrentUser().getLogin();
                String mockData = createMockData(serviceRef, mockURL);
                storage.addContent(user, designId, ApiContentType.Mock, mockData);
            } catch (Exception e) {
                logger.error("Failed to record API mock publication in database.", e);
            }

            // Finally return response.
            MockReference mockRef = new MockReference();
            mockRef.setMockType("microcks");
            mockRef.setServiceRef(serviceRef);
            mockRef.setMockURL(mockURL);
            return mockRef;
        } catch (MicrocksConnectorException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#getMocks(java.lang.String, java.lang.Integer, java.lang.Integer)
     */
    @Override
    public Collection<ApiMock> getMocks(String designId, Integer start, Integer end)
            throws ServerError, NotFoundException {
        int from = 0;
        int to = 20;
        if (start != null) {
            from = start.intValue();
        }
        if (end != null) {
            to = end.intValue();
        }

        try {
            final User currentUser = this.security.getCurrentUser();
            if (!this.authorizationService.hasWritePermission(currentUser, designId)) {
                throw new NotFoundException();
            }
            return this.storage.listApiDesignMocks(designId, from, to);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    @Override
    public Collection<ApiTemplatePublication> getTemplatePublications(String designId, Integer start, Integer end) throws ServerError, NotFoundException {
        logger.debug("Loading template activity for API: {}", designId);
        metrics.apiCall("/designs/{designId}/templates", "GET");
        int from = 0;
        int to = 20;
        if (start != null) {
            from = start.intValue();
        }
        if (end != null) {
            to = end.intValue();
        }

        try {
            final User user = this.security.getCurrentUser();
            if (!this.authorizationService.hasWritePermission(user, designId)) {
                throw new NotFoundException();
            }
            return this.storage.listApiTemplatePublications(designId, from, to);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    @Override
    public void publishTemplate(String designId, NewApiTemplate newApiTemplate) throws ServerError, NotFoundException, AccessDeniedException {
        logger.debug("Publishing a template from API: {}", designId);
        metrics.apiCall("/designs/{designId}/templates", "POST");
        final User user = this.security.getCurrentUser();
        final String userLogin = user.getLogin();
        try {
            if (!this.authorizationService.hasTemplateCreationPermission(user)) {
                throw new AccessDeniedException();
            }
            if (!this.authorizationService.hasWritePermission(user, designId)) {
                throw new NotFoundException();
            }
            // Apply the pending commands to get an up-to-date version number
            final ApiDesign apiDesign = this.storage.getApiDesign(userLogin, designId);
            final ApiDesignContent latestDocument = this.storage.getLatestContentDocument(userLogin, designId);
            long version = latestDocument.getContentVersion();
            final FormatType formatType = apiDesign.getType() == ApiDesignType.GraphQL
                    ? FormatType.SDL
                    : FormatType.JSON;
            String documentAsString = getApiContent(designId, formatType, false);
            // Create the template
            final StoredApiTemplate storedApiTemplate = newApiTemplate.toStoredApiTemplate();
            final String templateId = UUID.randomUUID().toString();
            storedApiTemplate.setTemplateId(templateId);
            storedApiTemplate.setType(apiDesign.getType());
            storedApiTemplate.setOwner(userLogin);
            storedApiTemplate.setDocument(documentAsString);
            this.storage.createApiTemplate(storedApiTemplate);
            // Store the publication metadata
            final String templateData = createTemplateData(designId, newApiTemplate, version);
            this.storage.addContent(userLogin, designId, ApiContentType.Template, templateData);

        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * Creates the JSON data to be stored in the data row representing a "publish API" event
     * (also known as an API publication).
     * @param info
     */
    private String createPublicationData(NewApiPublication info) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode data = JsonNodeFactory.instance.objectNode();
            data.set("type", JsonNodeFactory.instance.textNode(info.getType().name()));
            data.set("org", JsonNodeFactory.instance.textNode(info.getOrg()));
            data.set("repo", JsonNodeFactory.instance.textNode(info.getRepo()));
            data.set("team", JsonNodeFactory.instance.textNode(info.getTeam()));
            data.set("group", JsonNodeFactory.instance.textNode(info.getGroup()));
            data.set("project", JsonNodeFactory.instance.textNode(info.getProject()));
            data.set("branch", JsonNodeFactory.instance.textNode(info.getBranch()));
            data.set("resource", JsonNodeFactory.instance.textNode(info.getResource()));
            data.set("format", JsonNodeFactory.instance.textNode(info.getFormat().name()));
            data.set("commitMessage", JsonNodeFactory.instance.textNode(info.getCommitMessage()));
            return mapper.writeValueAsString(data);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Create the JSON data to be stored in the data row representing a "mock API" event
     * (also know as an API mock publication).
     * @param serviceRef The service reference as returned by Microcks
     * @param mockURL The URL for accessing description page on Microcks server
     */
    private String createMockData(String serviceRef, String mockURL) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode data = JsonNodeFactory.instance.objectNode();
            data.set("mockType", JsonNodeFactory.instance.textNode("microcks"));
            data.set("serviceRef", JsonNodeFactory.instance.textNode(serviceRef));
            data.set("mockURL", JsonNodeFactory.instance.textNode(mockURL));
            return mapper.writeValueAsString(data);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Create the JSON data to be stored in the data row representing an API template event.
     * @param designId the designId
     * @param newApiTemplate The template info from the API request
     */
    private String createTemplateData(String designId, NewApiTemplate newApiTemplate, long contentVersion) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode data = JsonNodeFactory.instance.objectNode();
            data.set("designId", JsonNodeFactory.instance.textNode(designId));
            data.set("contentVersion", JsonNodeFactory.instance.numberNode(contentVersion));
            data.set("name", JsonNodeFactory.instance.textNode(newApiTemplate.getName()));
            data.set("description", JsonNodeFactory.instance.textNode(newApiTemplate.getDescription()));
            return mapper.writeValueAsString(data);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Gets the current content of an API.
     * @param designId
     * @param format
     * @param dereference
     * @throws ServerError
     * @throws NotFoundException
     */
    private String getApiContent(String designId, FormatType format, boolean dereference) throws ServerError, NotFoundException {
        try {
            String user = this.security.getCurrentUser().getLogin();

            ApiDesign design = this.storage.getApiDesign(user, designId);

            ApiDesignContent designContent = this.storage.getLatestContentDocument(user, designId);
            String content = designContent.getDocument();

            if (design.getType() == ApiDesignType.GraphQL) {
                if (format != null && format != FormatType.SDL) {
                    throw new ServerError("Unsupported format: " + format);
                }
            } else {
                List<ApiDesignCommand> apiCommands = this.storage.listContentCommands(user, designId, designContent.getContentVersion());
                if (!apiCommands.isEmpty()) {
                    List<String> commands = new ArrayList<>(apiCommands.size());
                    for (ApiDesignCommand apiCommand : apiCommands) {
                        commands.add(apiCommand.getCommand());
                    }
                    content = this.oaiCommandExecutor.executeCommands(designContent.getDocument(), commands);
                }

                // If we should dereference the content, do that now.
                if (dereference) {
                    content = dereferencer.dereference(content);
                }

                // Convert to yaml if necessary
                if (format == FormatType.YAML) {
                    content = FormatUtils.jsonToYaml(content);
                } else {
                    content = FormatUtils.formatJson(content);
                }
            }

            return content;
        } catch (StorageException | OaiCommandException | IOException | UnresolvableReferenceException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#getCodegenProjects(java.lang.String)
     */
    @Override
    public Collection<CodegenProject> getCodegenProjects(String designId)
            throws ServerError, NotFoundException {
        logger.debug("Retrieving codegen project list for design with ID: {}", designId);
        metrics.apiCall("/designs/{designId}/codegen/projects", "GET");

        try {
            String user = this.security.getCurrentUser().getLogin();
            ApiDesign design = this.storage.getApiDesign(user, designId);
            return this.storage.listCodegenProjects(user, design.getId());
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#createCodegenProject(java.lang.String, io.apicurio.hub.api.beans.NewCodegenProject)
     */
    @Override
    public CodegenProject createCodegenProject(String designId, NewCodegenProject body)
            throws ServerError, NotFoundException, AccessDeniedException {
        logger.debug("Creating a codegen project for API: {} ", designId);
        metrics.apiCall("/designs/{designId}/codegen/projects", "POST");

        try {
            final User currentUser = this.security.getCurrentUser();
            String userLogin = currentUser.getLogin();

            ApiDesign design = this.storage.getApiDesign(userLogin, designId);
            if (!this.authorizationService.hasWritePermission(currentUser, designId)) {
                throw new AccessDeniedException();
            }

            CodegenProject project = new CodegenProject();
            Date now = new Date();
            project.setCreatedBy(userLogin);
            project.setCreatedOn(now);
            project.setModifiedBy(userLogin);
            project.setModifiedOn(now);
            project.setDesignId(design.getId());
            project.setType(body.getProjectType());

            project.setAttributes(new HashMap<String, String>());
            if (body.getProjectConfig() != null) {
                project.getAttributes().putAll(body.getProjectConfig());
            }
            project.getAttributes().put("location", body.getLocation().toString());
            project.getAttributes().put("update-only", Boolean.FALSE.toString());
            if (body.getPublishInfo() != null) {
                if (body.getPublishInfo().getType() != null) {
                    project.getAttributes().put("publish-type", body.getPublishInfo().getType().toString());
                }
                project.getAttributes().put("publish-branch", body.getPublishInfo().getBranch());
                project.getAttributes().put("publish-commitMessage", body.getPublishInfo().getCommitMessage());
                project.getAttributes().put("publish-group", body.getPublishInfo().getGroup());
                project.getAttributes().put("publish-location", body.getPublishInfo().getLocation());
                project.getAttributes().put("publish-org", body.getPublishInfo().getOrg());
                project.getAttributes().put("publish-project", body.getPublishInfo().getProject());
                project.getAttributes().put("publish-repo", body.getPublishInfo().getRepo());
                project.getAttributes().put("publish-team", body.getPublishInfo().getTeam());
            }

            if (body.getLocation() == CodegenLocation.download) {
                // Nothing extra to do when downloading - that will be handled by a separate call
            }

            if (body.getLocation() == CodegenLocation.sourceControl) {
                String prUrl = generateAndPublishProject(project, false);
                project.getAttributes().put("pullRequest-url", prUrl);
            }

            String projectId = this.storage.createCodegenProject(userLogin, project);
            project.setId(projectId);

            return project;
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#getCodegenProjectAsZip(java.lang.String, java.lang.String)
     */
    @Override
    public Response getCodegenProjectAsZip(String designId, String projectId)
            throws ServerError, NotFoundException, AccessDeniedException {
        logger.debug("Downloading a codegen project for API Design with ID {}", designId);
        metrics.apiCall("/designs/{designId}/codegen/projects/{projectId}/zip", "GET");

        final User currentUser = this.security.getCurrentUser();
        String userLogin = currentUser.getLogin();

        try {
            if (!this.authorizationService.hasWritePermission(currentUser, designId)) {
                throw new AccessDeniedException();
            }

            CodegenProject project = this.storage.getCodegenProject(userLogin, designId, projectId);
            String content = this.getApiContent(designId, FormatType.JSON, true);

            // TODO support other types besides jax-rs
            if (project.getType() == CodegenProjectType.thorntail) {
                JaxRsProjectSettings settings = toJaxRsSettings(project);

                boolean updateOnly = "true".equals(project.getAttributes().get("update-only"));

                final OpenApi2Thorntail generator = new OpenApi2Thorntail();
                generator.setSettings(settings);
                generator.setOpenApiDocument(content);
                generator.setUpdateOnly(updateOnly);

                return asResponse(settings, generator);
            } else if (project.getType() == CodegenProjectType.jaxrs) {
                JaxRsProjectSettings settings = toJaxRsSettings(project);

                boolean updateOnly = "true".equals(project.getAttributes().get("update-only"));

                final OpenApi2JaxRs generator = new OpenApi2JaxRs();
                generator.setSettings(settings);
                generator.setOpenApiDocument(content);
                generator.setUpdateOnly(updateOnly);

                return asResponse(settings, generator);
            } else if (project.getType() == CodegenProjectType.quarkus) {
                JaxRsProjectSettings settings = toJaxRsSettings(project);

                boolean updateOnly = "true".equals(project.getAttributes().get("update-only"));

                final OpenApi2Quarkus generator = new OpenApi2Quarkus();
                generator.setSettings(settings);
                generator.setOpenApiDocument(content);
                generator.setUpdateOnly(updateOnly);

                return asResponse(settings, generator);
            } else {
                throw new ServerError("Unsupported project type: " + project.getType());
            }
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * Generates the project and returns the result as a streaming response.
     * @param settings
     * @param generator
     */
    private Response asResponse(JaxRsProjectSettings settings, final OpenApi2JaxRs generator) {
        StreamingOutput stream = new StreamingOutput() {
            @Override
            public void write(OutputStream output) throws IOException, WebApplicationException {
                generator.generate(output);
            }
        };

        String fname = settings.artifactId + ".zip";
        ResponseBuilder builder = Response.ok().entity(stream)
                .header("Content-Disposition", "attachment; filename=\"" + fname + "\"")
                .header("Content-Type", "application/zip");

        return builder.build();
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#updateCodegenProject(java.lang.String, java.lang.String, io.apicurio.hub.api.beans.UpdateCodgenProject)
     */
    @Override
    public CodegenProject updateCodegenProject(String designId, String projectId, UpdateCodgenProject body)
            throws ServerError, NotFoundException, AccessDeniedException {
        logger.debug("Updating codegen project for API: {}", designId);
        metrics.apiCall("/designs/{designId}/codegen/projects/{projectId}", "PUT");

        try {
            final User currentUser = this.security.getCurrentUser();
            String userLogin = currentUser.getLogin();
            if (!this.authorizationService.hasWritePermission(currentUser, designId)) {
                throw new AccessDeniedException();
            }

            CodegenProject project = this.storage.getCodegenProject(userLogin, designId, projectId);
            project.setType(body.getProjectType());

            project.setAttributes(new HashMap<String, String>());
            if (body.getProjectConfig() != null) {
                project.getAttributes().putAll(body.getProjectConfig());
            }
            project.getAttributes().put("location", body.getLocation().toString());
            project.getAttributes().put("update-only", Boolean.TRUE.toString());
            if (body.getPublishInfo() != null) {
                if (body.getPublishInfo().getType() != null) {
                    project.getAttributes().put("publish-type", body.getPublishInfo().getType().toString());
                }
                project.getAttributes().put("publish-branch", body.getPublishInfo().getBranch());
                project.getAttributes().put("publish-commitMessage", body.getPublishInfo().getCommitMessage());
                project.getAttributes().put("publish-group", body.getPublishInfo().getGroup());
                project.getAttributes().put("publish-location", body.getPublishInfo().getLocation());
                project.getAttributes().put("publish-org", body.getPublishInfo().getOrg());
                project.getAttributes().put("publish-project", body.getPublishInfo().getProject());
                project.getAttributes().put("publish-repo", body.getPublishInfo().getRepo());
                project.getAttributes().put("publish-team", body.getPublishInfo().getTeam());
            }

            if (body.getLocation() == CodegenLocation.download) {
                // Nothing extra to do when downloading - that will be handled by a separate call
            }

            if (body.getLocation() == CodegenLocation.sourceControl) {
                String prUrl = generateAndPublishProject(project, true);
                project.getAttributes().put("pullRequest-url", prUrl);
            }

            this.storage.updateCodegenProject(userLogin, project);

            return project;
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#deleteCodegenProject(java.lang.String, java.lang.String)
     */
    @Override
    public void deleteCodegenProject(String designId, String projectId)
            throws ServerError, NotFoundException, AccessDeniedException {
        logger.debug("Deleting codegen project for API: {}", designId);
        metrics.apiCall("/designs/{designId}/codegen/projects/{projectId}", "DELETE");

        try {
            final User currentUser = this.security.getCurrentUser();
            String userLogin = currentUser.getLogin();
            if (!this.authorizationService.hasWritePermission(currentUser, designId)) {
                throw new AccessDeniedException();
            }
            this.storage.deleteCodegenProject(userLogin, designId, projectId);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#deleteCodegenProjects(java.lang.String)
     */
    @Override
    public void deleteCodegenProjects(String designId) throws ServerError, NotFoundException, AccessDeniedException {
        logger.debug("Deleting ALL codegen projects for API: {}", designId);
        metrics.apiCall("/designs/{designId}/codegen/projects", "DELETE");

        try {
            final User currentUser = this.security.getCurrentUser();
            String userLogin = currentUser.getLogin();
            if (!this.authorizationService.hasWritePermission(currentUser, designId)) {
                throw new AccessDeniedException();
            }
            this.storage.deleteCodegenProjects(userLogin, designId);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * Generate and publish (to a git/source control system) a project.  This will
     * generate a project from the OpenAPI document and then publish the result to
     * a source control platform.
     * @param project
     * @param updateOnly
     * @return the URL of the published pull request
     */
    private String generateAndPublishProject(CodegenProject project, boolean updateOnly)
            throws ServerError, NotFoundException {
        try {
            String content = this.getApiContent(project.getDesignId(), FormatType.JSON, true);

            // Dereference the document so that we have everything we need in a single place
            content = dereferencer.dereference(content);

            // Generate the type of project being requested.
            if (project.getType() == CodegenProjectType.thorntail) {
                JaxRsProjectSettings settings = toJaxRsSettings(project);

                OpenApi2Thorntail generator = new OpenApi2Thorntail();
                generator.setSettings(settings);
                generator.setOpenApiDocument(content);
                generator.setUpdateOnly(updateOnly);

                return generateAndPublish(project, generator);
            } else if (project.getType() == CodegenProjectType.jaxrs) {
                JaxRsProjectSettings settings = toJaxRsSettings(project);

                OpenApi2JaxRs generator = new OpenApi2JaxRs();
                generator.setSettings(settings);
                generator.setOpenApiDocument(content);
                generator.setUpdateOnly(updateOnly);

                return generateAndPublish(project, generator);
            } else if (project.getType() == CodegenProjectType.quarkus) {
                JaxRsProjectSettings settings = toJaxRsSettings(project);

                OpenApi2Quarkus generator = new OpenApi2Quarkus();
                generator.setSettings(settings);
                generator.setOpenApiDocument(content);
                generator.setUpdateOnly(updateOnly);

                return generateAndPublish(project, generator);
            } else {
                throw new ServerError("Unsupported project type: " + project.getType());
            }
        } catch (IOException | SourceConnectorException | UnresolvableReferenceException e) {
            throw new ServerError(e);
        }
    }

    /**
     * Generates the project and publishes the result to e.g. GitHub.
     * @param project
     * @param generator
     * @throws IOException
     * @throws NotFoundException
     * @throws SourceConnectorException
     */
    private String generateAndPublish(CodegenProject project, OpenApi2JaxRs generator)
            throws IOException, NotFoundException, SourceConnectorException {
        ByteArrayOutputStream generatedContent = generator.generate();
        LinkedAccountType scsType = LinkedAccountType.valueOf(project.getAttributes().get("publish-type"));

        ISourceConnector connector = this.sourceConnectorFactory.createConnector(scsType);
        String url = toSourceResourceUrl(project);
        String commitMessage = project.getAttributes().get("publish-commitMessage");
        String pullRequestUrl = connector.createPullRequestFromZipContent(url, commitMessage,
                new ZipInputStream(new ByteArrayInputStream(generatedContent.toByteArray())));
        return pullRequestUrl;
    }

    /**
     * Reads JAX-RS project settings from the project.
     * @param project
     */
    private JaxRsProjectSettings toJaxRsSettings(CodegenProject project) {
        boolean codeOnly = "true".equals(project.getAttributes().get("codeOnly"));
        boolean reactive = "true".equals(project.getAttributes().get("reactive"));
        boolean generateCliCi = "true".equals(project.getAttributes().get("generateCliCi"));
        String groupId = project.getAttributes().get("groupId");
        String artifactId = project.getAttributes().get("artifactId");
        String javaPackage = project.getAttributes().get("javaPackage");

        JaxRsProjectSettings settings = new JaxRsProjectSettings();
        settings.codeOnly = codeOnly;
        settings.reactive = reactive;
        settings.cliGenCI = generateCliCi;
        settings.groupId = groupId != null ? groupId : "org.example.api";
        settings.artifactId = artifactId != null ? artifactId : "generated-api";
        settings.javaPackage = javaPackage != null ? javaPackage : "org.example.api";

        return settings;
    }

    /**
     * Creates a source control resource URL from the information found in the codegen project.
     * @param project
     */
    private String toSourceResourceUrl(CodegenProject project) {
        LinkedAccountType scsType = LinkedAccountType.valueOf(project.getAttributes().get("publish-type"));
        String url;
        switch (scsType) {
            case Bitbucket: {
                String team = project.getAttributes().get("publish-team");
                String repo = project.getAttributes().get("publish-repo");
                String branch = project.getAttributes().get("publish-branch");
                String path = project.getAttributes().get("publish-location");
                url = bitbucketResolver.create(team, repo, branch, path);
            }
            break;
            case GitHub: {
                String org = project.getAttributes().get("publish-org");
                String repo = project.getAttributes().get("publish-repo");
                String branch = project.getAttributes().get("publish-branch");
                String path = project.getAttributes().get("publish-location");
                url = gitHubResolver.create(org, repo, branch, path);
            }
            break;
            case GitLab: {
                String group = project.getAttributes().get("publish-group");
                String proj = project.getAttributes().get("publish-project");
                String branch = project.getAttributes().get("publish-branch");
                String path = project.getAttributes().get("publish-location");
                url = gitLabResolver.create(group, proj, branch, path);
            }
            break;
            default:
                throw new RuntimeException("Unsupported type: " + scsType);
        }
        return url;
    }

    /**
     * Uses the information in the bean to create a resource URL.
     */
    private String toResourceUrl(NewApiPublication info) {
        if (info.getType() == LinkedAccountType.GitHub) {
            return gitHubResolver.create(info.getOrg(), info.getRepo(), info.getBranch(), info.getResource());
        }
        if (info.getType() == LinkedAccountType.GitLab) {
            return gitLabResolver.create(info.getGroup(), info.getProject(), info.getBranch(), info.getResource());
        }
        if (info.getType() == LinkedAccountType.Bitbucket) {
            return bitbucketResolver.create(info.getTeam(), info.getRepo(), info.getBranch(), info.getResource());
        }
        return null;
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#validateDesign(java.lang.String)
     */
    @Override
    public List<ValidationError> validateDesign(String designId) throws ServerError, NotFoundException {
        logger.debug("Validating API design with ID: {}", designId);
        metrics.apiCall("/designs/{designId}/validation", "GET");

        // TODO support validation of GraphQL APIs.

        // TODO should dereference be fetched from query here?
        String content = this.getApiContent(designId, FormatType.JSON, false);

        Document doc = Library.readDocumentFromJSONString(content);
        List<ValidationProblem> problems = Library.validate(doc, new IValidationSeverityRegistry() {
            @Override
            public ValidationProblemSeverity lookupSeverity(ValidationRuleMetaData rule) {
                return ValidationProblemSeverity.high;
            }
        });
        List<ValidationError> errors = new ArrayList<>();
        for (ValidationProblem problem : problems) {
            errors.add(new ValidationError(problem.errorCode, problem.nodePath.toString(), problem.property,
                    problem.message, problem.severity.name()));
        }
        return errors;
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#configureSharing(java.lang.String, io.apicurio.hub.core.beans.UpdateSharingConfiguration)
     */
    @Override
    public SharingConfiguration configureSharing(String designId, UpdateSharingConfiguration config)
            throws ServerError, NotFoundException {
        logger.debug("Configuring sharing settings for API: {} ", designId);
        metrics.apiCall("/designs/{designId}/sharing", "PUT");

        try {
            final User currentUser = this.security.getCurrentUser();
            String uuid = UUID.randomUUID().toString(); // Note: only used if this is the first time

            if (!this.authorizationService.hasOwnerPermission(currentUser, designId)) {
                throw new NotFoundException();
            }
            
            if (SharingLevel.DOCUMENTATION == config.getLevel()) {
                final ApiDesignContent document = this.storage.getLatestContentDocument(currentUser.getLogin(), designId);
                final String content = document.getDocument();
                final DereferenceControlResult dereferenceControlResult = accessibilityAsserter.isDereferenceable(content);
                if (!dereferenceControlResult.isSuccess()) {
                    throw new ServerError(dereferenceControlResult.getError());
                }
            }

            this.storage.setSharingConfig(designId, uuid, config.getLevel());

            return this.storage.getSharingConfig(designId);
        } catch (StorageException e) {
            throw new ServerError(e);
        }

    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#getSharingConfiguration(java.lang.String)
     */
    @Override
    public SharingConfiguration getSharingConfiguration(String designId)
            throws ServerError, NotFoundException {
        logger.debug("Getting sharing settings for API: {} ", designId);
        metrics.apiCall("/designs/{designId}/sharing", "GET");

        // Make sure we have access to the design.
        this.getDesign(designId);

        try {
            SharingConfiguration sharingConfig = this.storage.getSharingConfig(designId);
            if (sharingConfig == null) {
                sharingConfig = new SharingConfiguration();
                sharingConfig.setLevel(SharingLevel.NONE);
            }
            return sharingConfig;
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

}
