package io.apicurio.studio.rest.v1.impl.ex;

import io.apicurio.studio.StudioAppException;

import java.util.function.Predicate;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
public class BadRequestException extends StudioAppException {

    private static final long serialVersionUID = -8366496167281697695L;

    public BadRequestException(String message) {
        super(message);
    }

    public BadRequestException(String message, Throwable cause) {
        super(message, cause);
    }

    public static <T> void requireNotNullAnd(T parameter, String message, Predicate<T> isValid) {
        if (parameter == null || !isValid.test(parameter)) {
            throw new BadRequestException(message);
        }
    }
}
