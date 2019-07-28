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

import java.io.IOException;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import io.apicurio.hub.api.beans.ValidationError;

/**
 * @author eric.wittmann@gmail.com
 */
@Path("utils")
public interface IUtilsResource {

    @POST
    @Path("/validation")
    @Consumes({ MediaType.APPLICATION_JSON, "application/x-yaml" })
    @Produces(MediaType.APPLICATION_JSON)
    public List<ValidationError> validation(String content) throws IOException;

}
