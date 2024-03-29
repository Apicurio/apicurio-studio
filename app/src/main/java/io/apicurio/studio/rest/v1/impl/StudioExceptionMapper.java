package io.apicurio.studio.rest.v1.impl;

import static java.net.HttpURLConnection.HTTP_BAD_REQUEST;
import static java.net.HttpURLConnection.HTTP_CONFLICT;
import static java.net.HttpURLConnection.HTTP_INTERNAL_ERROR;
import static java.net.HttpURLConnection.HTTP_NOT_FOUND;
import static java.util.Optional.empty;
import static java.util.Optional.of;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.JsonParseException;

import io.apicurio.common.apps.config.Info;
import io.apicurio.studio.rest.v1.beans.Error;
import io.apicurio.studio.rest.v1.impl.ex.BadRequestException;
import io.apicurio.studio.spi.storage.ResourceAlreadyExistsStorageException;
import io.apicurio.studio.spi.storage.ResourceNotFoundStorageException;
import io.apicurio.studio.spi.storage.StudioStorageException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.validation.ValidationException;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 * TODO: CAC candidate
 * TODO: User error codes
 */
@ApplicationScoped
@Provider
public class StudioExceptionMapper implements ExceptionMapper<Throwable> {

    private final Logger log = LoggerFactory.getLogger(getClass());

    private static final Map<Class<? extends Exception>, Integer> CODE_MAP;

    @ConfigProperty(name = "apicurio.api.errors.include-stack-in-response", defaultValue = "false")
    @Info(category = "api", description = "Include stack trace in errors responses", availableSince = "1.0.0")
    boolean includeStackTrace;

    static {
        // NOTE: Subclasses of the entry will be matched as well.
        // Make sure that if a more specific exception requires a different error code,
        // it is inserted first.
        Map<Class<? extends Exception>, Integer> map = new LinkedHashMap<>();

        map.put(JsonParseException.class, HTTP_BAD_REQUEST);
        map.put(BadRequestException.class, HTTP_BAD_REQUEST); // TODO Maybe use ValidationException?
        map.put(ValidationException.class, HTTP_BAD_REQUEST);

        map.put(ResourceNotFoundStorageException.class, HTTP_NOT_FOUND);

        map.put(ResourceAlreadyExistsStorageException.class, HTTP_CONFLICT);

        map.put(StudioStorageException.class, HTTP_INTERNAL_ERROR);

        CODE_MAP = Collections.unmodifiableMap(map);
    }

    @Override
    public Response toResponse(Throwable exception) {

        Response.ResponseBuilder responseBuilder;

        var httpCode = HTTP_INTERNAL_ERROR;
        if (exception instanceof WebApplicationException) {
            WebApplicationException wae = (WebApplicationException) exception;
            Response response = wae.getResponse();
            httpCode = response.getStatus();
            responseBuilder = Response.fromResponse(response);
        } else {
            // Test for subclasses
            Optional<Integer> code = empty();
            for (Map.Entry<Class<? extends Exception>, Integer> entry : CODE_MAP.entrySet()) {
                if (entry.getKey().isAssignableFrom(exception.getClass())) {
                    code = of(entry.getValue());
                    break;
                }
            }
            httpCode = code.orElse(HTTP_INTERNAL_ERROR);
            responseBuilder = Response.status(httpCode);
        }

        if (httpCode == HTTP_INTERNAL_ERROR) {
            log.warn("Got an unknown exception (no exception mapping has been defined)", exception);
        }

        var errorBuilder = Error.builder()
                .errorCode(httpCode)
                .message(exception.getLocalizedMessage())
                .name(exception.getClass().getSimpleName());

        if (includeStackTrace) {
            var extendedReason = exception.getMessage();
            extendedReason += ". Details:\n";
            extendedReason += exception.getClass().getCanonicalName() + ": " + exception.getMessage() + "\n";

            StringWriter sw = new StringWriter(); // No need to close
            PrintWriter pw = new PrintWriter(sw); // No need to close
            exception.printStackTrace(pw);
            extendedReason += "Stack Trace:\n" + sw;

            errorBuilder.detail(extendedReason);
        } else {
            errorBuilder.detail(getRootMessage(exception));
        }

        return responseBuilder.type(MediaType.APPLICATION_JSON)
                .entity(errorBuilder.build())
                .build();
    }

    private static String getRootMessage(Throwable t) {
        return ExceptionUtils.getRootCauseMessage(t);
    }
}
