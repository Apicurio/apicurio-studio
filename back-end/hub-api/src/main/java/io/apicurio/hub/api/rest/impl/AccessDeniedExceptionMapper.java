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

import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

import io.apicurio.hub.core.exceptions.AccessDeniedException;

/**
 * @author eric.wittmann@gmail.com
 */
@Provider
public class AccessDeniedExceptionMapper implements ExceptionMapper<AccessDeniedException> {

    /**
     * Constructor.
     */
    public AccessDeniedExceptionMapper() {
    }
    
    /**
     * @see javax.ws.rs.ext.ExceptionMapper#toResponse(java.lang.Throwable)
     */
    @Override
    public Response toResponse(AccessDeniedException data) {
        ResponseBuilder builder = Response.status(403);
        return builder.build();
    }

}
