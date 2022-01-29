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

package io.apicurio.studio.rest;

import static java.net.HttpURLConnection.HTTP_CONFLICT;
import static java.net.HttpURLConnection.HTTP_INTERNAL_ERROR;
import static java.net.HttpURLConnection.HTTP_NOT_FOUND;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.function.Supplier;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;

import io.apicurio.common.apps.config.Dynamic;
import io.apicurio.common.apps.storage.exceptions.AlreadyExistsException;
import io.apicurio.common.apps.storage.exceptions.InvalidInputException;
import io.apicurio.common.apps.storage.exceptions.NotFoundException;
import io.apicurio.studio.rest.v1.beans.ErrorInfo;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
@Provider
public class AppExceptionMapper implements ExceptionMapper<Throwable> {

    private static final Map<Class<? extends Exception>, Integer> CODE_MAP;

    static {
        Map<Class<? extends Exception>, Integer> map = new HashMap<>();
        map.put(AlreadyExistsException.class, HTTP_CONFLICT);
        map.put(NotFoundException.class, HTTP_NOT_FOUND);
        map.put(InvalidInputException.class, HTTP_CONFLICT);
        CODE_MAP = Collections.unmodifiableMap(map);
    }

    public static Set<Class<? extends Exception>> getIgnored() {
        return CODE_MAP.keySet();
    }

    @Inject
    Logger log;

    @Dynamic @ConfigProperty(name = "studio.log.log500s", defaultValue = "true")
    Supplier<Boolean> log500s;

    @Context
    HttpServletRequest request;

    /**
     * @see javax.ws.rs.ext.ExceptionMapper#toResponse(java.lang.Throwable)
     */
    @Override
    public Response toResponse(Throwable t) {
        int code;
        Response.ResponseBuilder builder;

        if (t instanceof WebApplicationException) {
            WebApplicationException wae = (WebApplicationException) t;
            builder = Response.fromResponse(wae.getResponse());
            code = wae.getResponse().getStatus();
        } else {
            code = CODE_MAP.getOrDefault(t.getClass(), HTTP_INTERNAL_ERROR);
            builder = Response.status(code);
        }

        if (code == HTTP_INTERNAL_ERROR) {
            if (log500s.get()) {
                log.error(t.getMessage(), t);
            }
        }

        ErrorInfo error = toError(t, code);
        return builder.type(MediaType.APPLICATION_JSON)
                      .entity(error)
                      .build();
    }

    private ErrorInfo toError(Throwable t, int code) {
        ErrorInfo error = new ErrorInfo();

        error.setErrorCode(code);
        error.setMessage(t.getLocalizedMessage());
//        if (includeStackTrace) {
//            error.setDetail(getStackTrace(t));
//        } else {
        error.setDetail(getRootMessage(t));
//        }
        error.setName(t.getClass().getSimpleName());
        return error;
    }

    private static String getRootMessage(Throwable t) {
        return ExceptionUtils.getRootCauseMessage(t);
    }

}
