package io.apicurio.tests.utils;

import io.apicurio.studio.client.auth.VertXAuthFactory;
import io.vertx.core.Vertx;
import io.vertx.core.http.HttpClient;
import io.vertx.core.http.HttpClientOptions;
import io.vertx.core.http.HttpClientRequest;
import io.vertx.core.http.HttpClientResponse;
import io.vertx.core.http.HttpServer;
import io.vertx.core.http.HttpServerOptions;
import io.vertx.core.http.HttpServerRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.CompletableFuture;

public abstract class LimitingProxy {

    private static final Object LOCK = new Object();

    protected final Logger logger = LoggerFactory.getLogger(this.getClass().getName());

    private Vertx vertx;
    private int port = 30001;

    private HttpServer server;

    private HttpClient client;
    private String destinationHost;
    private int destinationPort;

    public LimitingProxy(String destinationHost, int destinationPort) {

        vertx = VertXAuthFactory.defaultVertx;
        client = vertx.createHttpClient(new HttpClientOptions());
        if (destinationHost.endsWith("127.0.0.1.nip.io")) {
            logger.info("Changing proxy destination host to localhost");
            this.destinationHost = "localhost";
        } else {
            this.destinationHost = destinationHost;
        }
        this.destinationPort = destinationPort;
    }

    public String getServerUrl() {
        return "http://localhost:" + port;
    }

    public CompletableFuture<HttpServer> start() {

        CompletableFuture<HttpServer> serverFuture = new CompletableFuture<>();

        server = vertx.createHttpServer(new HttpServerOptions()
                        .setPort(port))
                .requestHandler(this::proxyRequest)
            .listen(server -> {
                if (server.succeeded()) {
                    logger.info("Proxy server started on port {}", port);
                    logger.info("Proxying server {}:{}", destinationHost, destinationPort);
                    serverFuture.complete(server.result());
                } else {
                    logger.error("Error starting server", server.cause());
                    serverFuture.completeExceptionally(server.cause());
                }
            });

        return serverFuture;
    }

    public void stop() {
        if (server != null) {
            server.close();
        }
    }

    abstract protected boolean allowed();

    private void proxyRequest(HttpServerRequest req) {

        boolean allowed;
        synchronized (LOCK) {
            allowed = allowed();
        }

        if (!allowed) {
            logger.info("Rejecting request");
            req.response().setStatusCode(429);
            req.response().end();
            return;
        }
        logger.info("Allowing request, redirecting");

        req.pause();

        client.request(req.method(), destinationPort, destinationHost, req.uri())
            .onSuccess(clientReq -> executeProxy(clientReq, req))
            .onFailure(throwable -> logger.error("Error found creating request", throwable));
    }

    private void executeProxy(HttpClientRequest clientReq, HttpServerRequest req) {
        clientReq.response(reqResult -> {
            if (reqResult.succeeded()) {
                HttpClientResponse clientRes = reqResult.result();
                req.response().setChunked(true);
                req.response().setStatusCode(clientRes.statusCode());
                req.response().headers().setAll(clientRes.headers());
                clientRes.handler(data -> req.response().write(data));
                clientRes.endHandler((v) -> req.response().end());
                clientRes.exceptionHandler(e -> logger.error("Error caught in response of request to serverless", e));
                req.response().exceptionHandler(e -> logger.error("Error caught in response to client", e));
            } else {
                logger.error("Error in async result", reqResult.cause());
            }
        });

        clientReq.setChunked(true);
        clientReq.headers().setAll(req.headers());

        if (req.isEnded()) {
            clientReq.end();
        } else {
            req.handler(data -> {
                clientReq.write(data);
            });
            req.endHandler((v) -> {
                clientReq.end();
            });
            clientReq.exceptionHandler(e -> {
                logger.error("Error caught in proxiying request", e);
                req.response().setStatusCode(500).putHeader("x-error", e.getMessage()).end();
            });
        }
        req.resume();

        req.exceptionHandler(e -> {
            logger.error("Error caught in request from client", e);
        });

    }

}
