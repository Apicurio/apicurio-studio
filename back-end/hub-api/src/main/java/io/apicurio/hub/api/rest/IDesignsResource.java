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

package io.apicurio.hub.api.rest;

import java.io.InputStream;
import java.util.Collection;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import io.apicurio.hub.api.beans.ImportApiDesign;
import io.apicurio.hub.api.beans.NewApiDesign;
import io.apicurio.hub.api.beans.NewApiPublication;
import io.apicurio.hub.api.beans.NewApiTemplate;
import io.apicurio.hub.api.beans.NewCodegenProject;
import io.apicurio.hub.api.beans.UpdateCodgenProject;
import io.apicurio.hub.api.beans.UpdateCollaborator;
import io.apicurio.hub.api.beans.ValidationError;
import io.apicurio.hub.core.beans.ApiDesign;
import io.apicurio.hub.core.beans.ApiDesignChange;
import io.apicurio.hub.core.beans.ApiDesignCollaborator;
import io.apicurio.hub.core.beans.ApiMock;
import io.apicurio.hub.core.beans.ApiPublication;
import io.apicurio.hub.core.beans.ApiTemplatePublication;
import io.apicurio.hub.core.beans.CodegenProject;
import io.apicurio.hub.core.beans.Contributor;
import io.apicurio.hub.core.beans.Invitation;
import io.apicurio.hub.core.beans.MockReference;
import io.apicurio.hub.core.beans.SharingConfiguration;
import io.apicurio.hub.core.beans.UpdateSharingConfiguration;
import io.apicurio.hub.core.exceptions.AccessDeniedException;
import io.apicurio.hub.core.exceptions.ApiValidationException;
import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.exceptions.ServerError;

/**
 * The interface that defines how to interact with API Designs in the hub API.
 * 
 * @author eric.wittmann@gmail.com
 */
@Path("designs")
public interface IDesignsResource {
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<ApiDesign> listDesigns() throws ServerError;
    
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public ApiDesign importDesign(ImportApiDesign info) throws ServerError, NotFoundException, ApiValidationException;
    
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public ApiDesign createDesign(NewApiDesign info) throws ServerError;
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{designId}")
    public ApiDesign getDesign(@PathParam("designId") String designId) throws ServerError, NotFoundException;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{designId}/session")
    public Response editDesign(@PathParam("designId") String designId) throws ServerError, NotFoundException;

    @PUT
    @Consumes({MediaType.APPLICATION_JSON, "application/x-yaml", "application/graphql"})
    @Path("{designId}")
    public void updateDesign(@PathParam("designId") String designId, InputStream content) throws ServerError, NotFoundException, ApiValidationException;

    @DELETE
    @Path("{designId}")
    public void deleteDesign(@PathParam("designId") String designId) throws ServerError, NotFoundException;
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{designId}/sharing")
    public SharingConfiguration getSharingConfiguration(@PathParam("designId") String designId) throws ServerError, NotFoundException;

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("{designId}/sharing")
    public SharingConfiguration configureSharing(@PathParam("designId") String designId, UpdateSharingConfiguration config) throws ServerError, NotFoundException;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{designId}/contributors")
    public Collection<Contributor> getContributors(@PathParam("designId") String designId) throws ServerError, NotFoundException;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{designId}/publications")
    public Collection<ApiPublication> getPublications(@PathParam("designId") String designId,
            @QueryParam("start") Integer start, @QueryParam("end") Integer end) throws ServerError, NotFoundException;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("{designId}/publications")
    public void publishApi(@PathParam("designId") String designId, NewApiPublication info, @QueryParam("dereference") String dereference) throws ServerError, NotFoundException;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{designId}/mocks")
    public Collection<ApiMock> getMocks(@PathParam("designId") String designId,
            @QueryParam("start") Integer start, @QueryParam("end") Integer end) throws ServerError, NotFoundException;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("{designId}/mocks")
    public MockReference mockApi(@PathParam("designId") String designId) throws ServerError, NotFoundException;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{designId}/templates")
    public Collection<ApiTemplatePublication> getTemplatePublications(@PathParam("designId") String designId,
                                                                      @QueryParam("start") Integer start, @QueryParam("end") Integer end) throws ServerError, NotFoundException;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("{designId}/templates")
    public void publishTemplate(@PathParam("designId") String designId, NewApiTemplate newApiTemplate) throws ServerError, NotFoundException, AccessDeniedException;

    @GET
    @Produces({ MediaType.APPLICATION_JSON, "application/x-yaml", "application/graphql" })
    @Path("{designId}/content")
    public Response getContent(@PathParam("designId") String designId, @QueryParam("format") String format, 
            @QueryParam("dereference") String dereference) throws ServerError, NotFoundException;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{designId}/invitations")
    public Collection<Invitation> getInvitations(@PathParam("designId") String designId) throws ServerError, NotFoundException;

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{designId}/invitations")
    public Invitation createInvitation(@PathParam("designId") String designId) throws ServerError, NotFoundException, AccessDeniedException;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{designId}/invitations/{inviteId}")
    public Invitation getInvitation(@PathParam("designId") String designId, @PathParam("inviteId") String inviteId) throws ServerError, NotFoundException;

    @PUT
    @Path("{designId}/invitations/{inviteId}")
    public void acceptInvitation(@PathParam("designId") String designId, @PathParam("inviteId") String inviteId) throws ServerError, NotFoundException;

    @DELETE
    @Path("{designId}/invitations/{inviteId}")
    public void rejectInvitation(@PathParam("designId") String designId, @PathParam("inviteId") String inviteId) throws ServerError, NotFoundException;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{designId}/collaborators")
    public Collection<ApiDesignCollaborator> getCollaborators(@PathParam("designId") String designId) throws ServerError, NotFoundException;

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("{designId}/collaborators/{userId}")
    public void updateCollaborator(@PathParam("designId") String designId, @PathParam("userId") String userId, UpdateCollaborator update) throws ServerError, NotFoundException, AccessDeniedException;

    @DELETE
    @Path("{designId}/collaborators/{userId}")
    public void deleteCollaborator(@PathParam("designId") String designId, @PathParam("userId") String userId) throws ServerError, NotFoundException, AccessDeniedException;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{designId}/activity")
    public Collection<ApiDesignChange> getActivity(@PathParam("designId") String designId,
            @QueryParam("start") Integer start, @QueryParam("end") Integer end) throws ServerError, NotFoundException;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{designId}/codegen/projects")
    public Collection<CodegenProject> getCodegenProjects(@PathParam("designId") String designId)
            throws ServerError, NotFoundException;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{designId}/codegen/projects")
    public CodegenProject createCodegenProject(@PathParam("designId") String designId, NewCodegenProject body)
            throws ServerError, NotFoundException, AccessDeniedException;

    @DELETE
    @Path("{designId}/codegen/projects")
    public void deleteCodegenProjects(@PathParam("designId") String designId)
            throws ServerError, NotFoundException, AccessDeniedException;

    @GET
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    @Path("{designId}/codegen/projects/{projectId}/zip")
    public Response getCodegenProjectAsZip(@PathParam("designId") String designId,
            @PathParam("projectId") String projectId) throws ServerError, NotFoundException, AccessDeniedException;

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("{designId}/codegen/projects/{projectId}")
    public CodegenProject updateCodegenProject(@PathParam("designId") String designId,
            @PathParam("projectId") String projectId, UpdateCodgenProject body)
            throws ServerError, NotFoundException, AccessDeniedException;

    @DELETE
    @Path("{designId}/codegen/projects/{projectId}")
    public void deleteCodegenProject(@PathParam("designId") String designId,
            @PathParam("projectId") String projectId) throws ServerError, NotFoundException, AccessDeniedException;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{designId}/validation")
    public List<ValidationError> validateDesign(@PathParam("designId") String designId) throws ServerError, NotFoundException;

}
