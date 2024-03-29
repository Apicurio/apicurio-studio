package io.apicurio.tests;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;
import java.util.concurrent.Callable;
import java.util.concurrent.TimeoutException;
import java.util.function.BooleanSupplier;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.eclipse.microprofile.config.ConfigProvider;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayNameGeneration;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestInstance.Lifecycle;
import org.junit.jupiter.api.extension.ExtendWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.microsoft.kiota.ApiException;

import io.apicurio.deployment.PortForwardManager;
import io.apicurio.studio.client.auth.VertXAuthFactory;
import io.apicurio.studio.rest.client.StudioClient;
import io.apicurio.tests.utils.Constants;
import io.apicurio.tests.utils.SimpleDisplayName;
import io.apicurio.tests.utils.StudioWaitUtils;
import io.apicurio.tests.utils.TestSeparator;
import io.kiota.http.vertx.VertXRequestAdapter;
import io.quarkus.test.common.http.TestHTTPResource;

/**
 * Base class for all base classes for integration tests or for integration tests directly.
 * This class must not contain any functionality nor implement any beforeAll, beforeEach.
 *
 */
@DisplayNameGeneration(SimpleDisplayName.class)
@TestInstance(Lifecycle.PER_CLASS)
@ExtendWith(PortForwardManager.class)
public class ApicurioStudioBaseIT implements TestSeparator, Constants {

    private static final Logger log = LoggerFactory.getLogger(ApicurioStudioBaseIT.class);

    @TestHTTPResource
    static URL STUDIO_URL;

    protected final Logger logger = LoggerFactory.getLogger(this.getClass().getName());

    protected Function<Exception, Integer> errorCodeExtractor = e -> ((ApiException)e).getResponseStatusCode();

    protected StudioClient studioClient;

    protected String authServerUrlConfigured;

    protected StudioClient createStudioClient() {
        var adapter = new VertXRequestAdapter(VertXAuthFactory.defaultVertx);
        adapter.setBaseUrl(getStudioV1ApiUrl());
        return new StudioClient(adapter);
    }

    @BeforeAll
    void beforeAll() {
        authServerUrlConfigured = Optional.ofNullable(ConfigProvider.getConfig().getConfigValue("studio.auth.token.endpoint").getValue())
                .orElse("http://localhost:8090/realms/studio/protocol/openid-connect/token");
        studioClient = createStudioClient();
    }

    @AfterEach
    public void afterEach() throws Exception {
    }

    //DO NOT USE FOR CREATE OR UPDATE OPERATIONS
    protected void retryOp(StudioWaitUtils.ConsumerExc<StudioClient> studioOp) throws Exception {
        StudioWaitUtils.retry(studioClient, studioOp);
    }

    //DO NOT USE FOR CREATE OR UPDATE OPERATIONS
    protected void retryAssertClientError(String expectedErrorName, int expectedCode, StudioWaitUtils.ConsumerExc<StudioClient> studioOp, Function<Exception, Integer> errorCodeExtractor) throws Exception {
        StudioWaitUtils.retry(studioClient, (rc) -> {
            assertClientError(expectedErrorName, expectedCode, () -> studioOp.run(rc), errorCodeExtractor);
        });
    }

    protected void ensureClusterSync(String designId) throws Exception {
        retry(() -> studioClient.designs().byDesignId(designId).get());
    }

    protected void ensureClusterSync(Consumer<StudioClient> function) throws Exception {
        retry(() -> function.accept(studioClient));
    }

    public static String resourceToString(String resourceName) {
        try (InputStream stream = Thread.currentThread().getContextClassLoader().getResourceAsStream(resourceName)) {
            assertNotNull(stream, "Resource not found: " + resourceName);
            return new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8)).lines().collect(Collectors.joining("\n"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static String getStudioHost() {
        if (STUDIO_URL != null) {
            return STUDIO_URL.getHost();
        } else {
            return System.getProperty("quarkus.http.test-host");
        }
    }

    public static int getStudioPort() {
        return Integer.parseInt(System.getProperty("quarkus.http.test-port"));
    }

    public static String getStudioApiUrl() {
        return getStudioBaseUrl().concat("/apis");
    }

    public static String getStudioV1ApiUrl() {
        return getStudioApiUrl().concat("/studio/v1");
    }

    public static String getStudioBaseUrl() {
        if (STUDIO_URL != null) {
            return String.format("http://%s:%s", STUDIO_URL.getHost(), STUDIO_URL.getPort());
        } else {
            return String.format("http://%s:%s", System.getProperty("quarkus.http.test-host"), System.getProperty("quarkus.http.test-port"));
        }
    }

    public static String getStudioBaseUrl(int port) {
        if (STUDIO_URL != null) {
            return String.format("http://%s:%s", STUDIO_URL.getHost(), port);
        } else {
            return String.format("http://%s:%s", System.getProperty("quarkus.http.test-host"), port);
        }
    }

    public static String getKeycloakBaseUrl() {
        if (System.getProperty("keycloak.external.endpoint") != null) {
            return String.format("http://%s:%s", System.getProperty("keycloak.external.endpoint"), 8090);
        }

        return "http://localhost:8090";
    }

    /**
     * @return true if Studio is ready for use, false in other cases
     */
    public boolean isReachable() {
        try (Socket socket = new Socket()) {
            String host = STUDIO_URL.getHost();
            int port = STUDIO_URL.getPort();
            log.info("Trying to connect to {}:{}", host, port);
            socket.connect(new InetSocketAddress(host, port), 5_000);
            log.info("Client is able to connect to Studio instance");
            return true;
        } catch (IOException ex) {
            log.warn("Cannot connect to Studio instance: {}", ex.getMessage());
            return false; // Either timeout or unreachable or failed DNS lookup.
        }
    }
    // ---

    /**
     * Poll the given {@code ready} function every {@code pollIntervalMs} milliseconds until it returns true,
     * or throw a TimeoutException if it doesn't returns true within {@code timeoutMs} milliseconds.
     * (helpful if you have several calls which need to share a common timeout)
     *
     * @return The remaining time left until timeout occurs
     */
    public long waitFor(String description, long pollIntervalMs, long timeoutMs, BooleanSupplier ready) throws TimeoutException {
        return waitFor(description, pollIntervalMs, timeoutMs, ready, () -> {
        });
    }

    public long waitFor(String description, long pollIntervalMs, long timeoutMs, BooleanSupplier ready, Runnable onTimeout) throws TimeoutException {
        log.debug("Waiting for {}", description);
        long deadline = System.currentTimeMillis() + timeoutMs;
        while (true) {
            boolean result;
            try {
                result = ready.getAsBoolean();
            } catch (Throwable e) {
                result = false;
            }
            long timeLeft = deadline - System.currentTimeMillis();
            if (result) {
                return timeLeft;
            }
            if (timeLeft <= 0) {
                onTimeout.run();
                TimeoutException exception = new TimeoutException("Timeout after " + timeoutMs + " ms waiting for " + description);
                exception.printStackTrace();
                throw exception;
            }
            long sleepTime = Math.min(pollIntervalMs, timeLeft);
            if (log.isTraceEnabled()) {
                log.trace("{} not ready, will try again in {} ms ({}ms till timeout)", description, sleepTime, timeLeft);
            }
            try {
                Thread.sleep(sleepTime);
            } catch (InterruptedException e) {
                return deadline - System.currentTimeMillis();
            }
        }
    }

    /**
     * Method to create and write String content file.
     *
     * @param filePath path to file
     * @param text     content
     */
    public void writeFile(String filePath, String text) {
        try {
            Files.write(new File(filePath).toPath(), text.getBytes(StandardCharsets.UTF_8));
        } catch (IOException e) {
            log.info("Exception during writing text in file");
        }
    }

    public void writeFile(Path filePath, String text) {
        try {
            Files.write(filePath, text.getBytes(StandardCharsets.UTF_8));
        } catch (IOException e) {
            log.info("Exception during writing text in file");
        }
    }

    @FunctionalInterface
    public static interface RunnableExc {
        void run() throws Exception;
    }

    public static void retry(RunnableExc runnable) throws Exception {
        retry(() -> {
            runnable.run();
            return null;
        });
    }

    public static void retry(RunnableExc runnable, long delta) throws Exception {
        retry(() -> {
            runnable.run();
            return null;
        }, delta);
    }

    public static <T> T retry(Callable<T> callable) throws Exception {
        return retry(callable, "Action #" + System.currentTimeMillis(), 20);
    }

    public static <T> T retry(Callable<T> callable, long delta) throws Exception {
        return retry(callable, "Action #" + System.currentTimeMillis(), 20, delta);
    }

    public static void retry(RunnableExc runnable, String name, int maxRetries) throws Exception {
        retry(() -> {
            runnable.run();
            return null;
        }, name, maxRetries);
    }

    private static <T> T retry(Callable<T> callable, String name, int maxRetries) throws Exception {
        return retry(callable, name, maxRetries, 100L);
    }

    private static <T> T retry(Callable<T> callable, String name, int maxRetries, long delta) throws Exception {
        Throwable error = null;
        int tries = maxRetries;
        int attempt = 1;
        while (tries > 0) {
            try {
                if (attempt > 1) {
                    log.debug("Retrying action [{}].  Attempt #{}", name, attempt);
                }
                return callable.call();
            } catch (Throwable t) {
                if (error == null) {
                    error = t;
                } else {
                    error.addSuppressed(t);
                }
                Thread.sleep(delta * attempt);
                tries--;
                attempt++;
            }
        }
        log.debug("Action [{}] failed after {} attempts.", name, attempt);
        Assertions.assertTrue(tries > 0, String.format("Failed handle callable: %s [%s]", callable, error));
        throw new IllegalStateException("Should not be here!");
    }

    public void assertClientError(String expectedErrorName, int expectedCode, RunnableExc runnable, Function<Exception, Integer> errorCodeExtractor) throws Exception {
        try {
            internalAssertClientError(expectedErrorName, expectedCode, runnable, errorCodeExtractor);
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    public void assertClientError(String expectedErrorName, int expectedCode, RunnableExc runnable, boolean retry, Function<Exception, Integer> errorCodeExtractor) throws Exception {
        if (retry) {
            retry(() -> internalAssertClientError(expectedErrorName, expectedCode, runnable, errorCodeExtractor));
        } else {
            internalAssertClientError(expectedErrorName, expectedCode, runnable, errorCodeExtractor);
        }
    }

    private void internalAssertClientError(String expectedErrorName, int expectedCode, RunnableExc runnable, Function<Exception, Integer> errorCodeExtractor) {
        try {
            runnable.run();
            Assertions.fail("Expected (but didn't get) a studio client application exception with code: " + expectedCode);
        } catch (Exception e) {
            Assertions.assertEquals(io.apicurio.studio.rest.client.models.Error.class, e.getClass());
            Assertions.assertEquals(expectedErrorName, ((io.apicurio.studio.rest.client.models.Error)e).getName());
            Assertions.assertEquals(expectedCode, ((io.apicurio.studio.rest.client.models.Error)e).getErrorCode());
        }
    }

    // some impl details ...

    public final String normalizeMultiLineString(String value) throws Exception {
        StringBuilder builder = new StringBuilder();
        BufferedReader reader = new BufferedReader(new StringReader(value));
        String line = reader.readLine();
        while (line != null) {
            builder.append(line);
            builder.append("\n");
            line = reader.readLine();
        }
        return builder.toString();
    }

    protected void assertNotAuthorized(Exception exception) {
        assertNotNull(exception);
        Assertions.assertEquals(RuntimeException.class, exception.getClass());
        Assertions.assertTrue(exception.getMessage().contains("unauthorized_client: Invalid client secret"));
    }

    protected void assertForbidden(Exception exception) {
        assertNotNull(exception);
        Assertions.assertEquals(ApiException.class, exception.getClass());
        Assertions.assertEquals(403, ((ApiException)exception).getResponseStatusCode());
    }
}
