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

package io.apicurio.hub.api.rest;

import io.apicurio.hub.api.beans.NewApiTemplate;
import io.apicurio.hub.api.beans.UpdateApiTemplate;
import io.apicurio.hub.core.beans.ApiDesignType;
import io.apicurio.hub.core.beans.ApiTemplate;
import io.apicurio.hub.core.beans.ApiTemplateKind;
import io.apicurio.hub.core.beans.StoredApiTemplate;
import io.apicurio.hub.core.exceptions.AccessDeniedException;
import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.exceptions.ServerError;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import java.util.List;

/**
 * These endpoints provide template management.
 * First phase will be read only
 * @author c.desc2@gmail.com
 */
@Path("templates")
public interface ITemplatesResource {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    List<ApiTemplate> getAllTemplates(@QueryParam("type") ApiDesignType type, @QueryParam("kind") ApiTemplateKind templateKind) throws ServerError;

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    StoredApiTemplate createStoredTemplate(NewApiTemplate template) throws ServerError, AccessDeniedException;

    @GET
    @Path("/{templateId}")
    @Produces(MediaType.APPLICATION_JSON)
    StoredApiTemplate getStoredTemplate(@PathParam("templateId") String templateId) throws ServerError, NotFoundException;

    @PUT
    @Path("/{templateId}")
    void updateStoredTemplate(@PathParam("templateId") String templateId, UpdateApiTemplate template) throws ServerError, NotFoundException, AccessDeniedException;

    @DELETE
    @Path("/{templateId}")
    void deleteStoredTemplate(@PathParam("templateId") String templateId) throws ServerError, NotFoundException, AccessDeniedException;
    
 
}
