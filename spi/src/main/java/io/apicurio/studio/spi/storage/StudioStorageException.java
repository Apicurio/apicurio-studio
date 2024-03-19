package io.apicurio.studio.spi.storage;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
public class StudioStorageException extends RuntimeException {

    private static final long serialVersionUID = 5993756013495297077L;

    public StudioStorageException(String message) {
        super(message);
    }

    public StudioStorageException(String message, Throwable cause) {
        super(message, cause);
    }
}
