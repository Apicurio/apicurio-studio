package io.apicurio.studio.spi.storage;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
public class ResourceNotFoundStorageException extends StudioStorageException {

    private static final long serialVersionUID = 8709328674400511064L;

    public ResourceNotFoundStorageException(String message) {
        super(message);
    }

    public ResourceNotFoundStorageException(String message, Throwable cause) {
        super(message, cause);
    }
}
