package io.apicurio.deployment;

import java.util.Optional;

public class Constants {

    /**
     * Studio image placeholder
     */
    static final String STUDIO_IMAGE = "studio-image";

    /**
     * Tag for auth tests profile.
     */
    static final String AUTH = "auth";

    /**
     * Tag for sql db upgrade tests profile.
     */
    static final String KAFKA_SQL = "kafkasqlit";

    /**
     * Tag for sql db upgrade tests profile.
     */
    static final String SQL = "sqlit";


    public static final String TEST_PROFILE =
            Optional.ofNullable(System.getProperty("groups"))
                    .orElse("");
}
