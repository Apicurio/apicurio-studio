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

import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.exceptions.ServerError;
import io.apicurio.registry.rest.beans.ArtifactMetaData;
import io.apicurio.registry.rest.beans.SearchedArtifact;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Collection;

/**
 * The interface that defines how to interact with an Apicurio Registry instance.
 * 
 * @author c.desc2@gmail.com
 */
@Path("registry")
public interface IRegistryResource {
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<SearchedArtifact> listArtifacts() throws ServerError;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{artifactId}")
    public ArtifactMetaData getArtifact(@PathParam("artifactId") String artifactId) throws ServerError, NotFoundException;

    @GET
    @Produces({ MediaType.APPLICATION_JSON, "application/x-yaml", "application/graphql" })
    @Path("{artifactId}/{artifactVersion}/content")
    public Response getContent(@PathParam("artifactId") String artifactId, @PathParam("artifactVersion") Integer artifactVersion,
                               @QueryParam("dereference") String dereference) throws ServerError, NotFoundException;

}
