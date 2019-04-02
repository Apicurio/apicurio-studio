/*
 * Copyright 2019 JBoss Inc
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

import io.apicurio.hub.core.beans.CreateValidationProfile;
import io.apicurio.hub.core.beans.UpdateValidationProfile;
import io.apicurio.hub.core.beans.ValidationProfile;
import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.exceptions.ServerError;

/**
 * The interface that defines how to interact with validation profiles in the Hub API.
 * 
 * @author eric.wittmann@gmail.com
 */
@Path("validationProfiles")
public interface IValidationProfilesResource {
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<ValidationProfile> listValidationProfiles() throws ServerError;
    
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public ValidationProfile createValidationProfile(CreateValidationProfile info) throws ServerError;

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("{profileId}")
    public void updateValidationProfile(@PathParam("profileId") String profileId, UpdateValidationProfile update) throws ServerError, NotFoundException;

    @DELETE
    @Path("{profileId}")
    public void deleteValidationProfile(@PathParam("profileId") String profileId) throws ServerError, NotFoundException;


}
