package io.apicurio.studio.spi.storage;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
public class ResourceAlreadyExistsStorageException extends StudioStorageException {

    private static final long serialVersionUID = 4566501443936704703L;

    public ResourceAlreadyExistsStorageException(String message, Throwable cause) {
        super(message, cause);
    }
}
