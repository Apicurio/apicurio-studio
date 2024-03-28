package io.apicurio.tests.utils;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;

/**
 * Interface for keep global constants used across system tests.
 */
public interface Constants {
    long POLL_INTERVAL = Duration.ofSeconds(1).toMillis();
    long TIMEOUT_FOR_STUDIO_START_UP = Duration.ofSeconds(25).toMillis();
    long TIMEOUT_FOR_STUDIO_READY = Duration.ofSeconds(30).toMillis();
    long TIMEOUT_GLOBAL = Duration.ofSeconds(30).toMillis();

    /**
     * Tag for tests, which are testing basic functionality
     */
    String SMOKE = "smoke";

    /**
     * Tag for auth tests, the suite will deploy apicurio studio with keycloak and verify the api is secured
     */
    String AUTH = "auth";

    /**
     * Tag for sql tests, the test will be executed only when the storage variant is sql.
     */
    String SQL = "sqlit";

    /**
     * Tag for sql storage db schema upgrade tests. Consists of one test that deploys an older version of the studio, populates the db, and then deploys the latest version of the studio.
     * Used to test the db schema upgrade process.
     */
    String DB_UPGRADE = "dbupgrade";

    Path LOGS_DIR = Paths.get("target/logs/");

    /**
     * Env var name for mandating the testsuite to avoid using docker for running required infrastructure
     */
    public static final String NO_DOCKER_ENV_VAR = "NO_DOCKER";

    /**
     * Current CI environment running the testsuite
     */
    public static final String CURRENT_ENV = "CURRENT_ENV";
    public static final String CURRENT_ENV_MAS_REGEX = ".*mas.*";

}
