package io.apicurio.studio;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
public class StudioAppException extends RuntimeException {

    private static final long serialVersionUID = -7260750324268131408L;

    public StudioAppException(String message) {
        super(message);
    }

    public StudioAppException(String message, Throwable cause) {
        super(message, cause);
    }
}
