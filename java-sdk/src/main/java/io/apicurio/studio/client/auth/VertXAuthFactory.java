package io.apicurio.studio.client.auth;

import io.vertx.core.Vertx;
import io.vertx.ext.auth.oauth2.OAuth2Auth;
import io.vertx.ext.auth.oauth2.OAuth2FlowType;
import io.vertx.ext.auth.oauth2.OAuth2Options;
import io.vertx.ext.auth.oauth2.Oauth2Credentials;
import io.vertx.ext.web.client.OAuth2WebClient;
import io.vertx.ext.web.client.WebClient;
import io.vertx.ext.web.client.WebClientSession;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class VertXAuthFactory {

    public final static Vertx defaultVertx = Vertx.vertx();

    public static WebClient buildOIDCWebClient(String tokenUrl, String clientId, String clientSecret) {
        return buildOIDCWebClient(defaultVertx, tokenUrl, clientId, clientSecret, null);
    }

    public static WebClient buildOIDCWebClient(Vertx vertx, String tokenUrl, String clientId, String clientSecret) {
        return buildOIDCWebClient(tokenUrl, clientId, clientSecret, null);
    }

    public static WebClient buildOIDCWebClient(String tokenUrl, String clientId, String clientSecret, String scope) {
        return buildOIDCWebClient(defaultVertx, tokenUrl, clientId, clientSecret, scope);
    }

    @SuppressWarnings("deprecation")
    public static WebClient buildOIDCWebClient(Vertx vertx, String tokenUrl, String clientId, String clientSecret, String scope) {
        WebClient webClient = WebClient.create(vertx);

        OAuth2Auth oAuth2Options = OAuth2Auth.create(vertx, new OAuth2Options()
                .setFlow(OAuth2FlowType.CLIENT)
                .setClientId(clientId)
                .setClientSecret(clientSecret)
                .setTokenPath(tokenUrl));

        Oauth2Credentials oauth2Credentials = new Oauth2Credentials();

        OAuth2WebClient oauth2WebClient = OAuth2WebClient.create(webClient, oAuth2Options);
        oauth2WebClient.withCredentials(oauth2Credentials);

        return oauth2WebClient;
    }

    public static WebClient buildSimpleAuthWebClient(String username, String password) {
        return buildSimpleAuthWebClient(defaultVertx, username, password);
    }

    public static WebClient buildSimpleAuthWebClient(Vertx vertx, String username, String password) {
        String usernameAndPassword = Base64.getEncoder().encodeToString((username + ":" + password).getBytes(StandardCharsets.UTF_8));
        return WebClientSession
                .create(WebClient.create(vertx))
                .addHeader("Authorization", "Basic " + usernameAndPassword);
    }

}