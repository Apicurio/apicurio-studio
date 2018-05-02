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

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import io.apicurio.hub.core.beans.ApiDesign;
import io.apicurio.hub.core.beans.ApiDesignChange;
import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.exceptions.ServerError;
import io.apicurio.studio.shared.beans.User;

/**
 * @author eric.wittmann@gmail.com
 */
@Path("currentuser")
public interface ICurrentUserResource {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public User getCurrentUser();

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("activity")
    public Collection<ApiDesignChange> getActivity(@QueryParam("start") Integer start, @QueryParam("end") Integer end) 
    		throws ServerError, NotFoundException;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("recent/designs")
    public Collection<ApiDesign> getRecentDesigns() throws ServerError;

}
