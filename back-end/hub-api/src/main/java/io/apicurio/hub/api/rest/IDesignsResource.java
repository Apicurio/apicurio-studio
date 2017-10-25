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

import java.util.Collection;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import io.apicurio.hub.api.beans.AddApiDesign;
import io.apicurio.hub.api.beans.ApiDesign;
import io.apicurio.hub.api.beans.Collaborator;
import io.apicurio.hub.api.beans.NewApiDesign;
import io.apicurio.hub.api.exceptions.NotFoundException;
import io.apicurio.hub.api.exceptions.ServerError;

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
    public ApiDesign addDesign(AddApiDesign info) throws ServerError, NotFoundException;
    
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public ApiDesign createDesign(NewApiDesign info) throws ServerError;

    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{designId}")
    public ApiDesign getDesign(@PathParam("designId") String designId) throws ServerError, NotFoundException;

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{designId}")
    public Response editDesign(@PathParam("designId") String designId) throws ServerError, NotFoundException;

    @DELETE
    @Path("{designId}")
    public void deleteDesign(@PathParam("designId") String designId) throws ServerError, NotFoundException;
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{designId}/collaborators")
    public Collection<Collaborator> getCollaborators(@PathParam("designId") String designId) throws ServerError, NotFoundException;

    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{designId}/content")
    public Response getContent(@PathParam("designId") String designId) throws ServerError, NotFoundException;
    
}
