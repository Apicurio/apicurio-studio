package io.apicurio.hub.api.security;

import com.fasterxml.jackson.databind.JsonNode;
import io.apicurio.hub.api.beans.DeviceSession;
import io.apicurio.hub.core.config.HubConfiguration;
import io.apicurio.hub.core.util.JsonUtil;
import org.apache.commons.io.IOUtils;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustSelfSignedStrategy;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.ssl.SSLContexts;
import org.keycloak.common.util.KeycloakUriBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.net.ssl.SSLContext;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.*;

@ApplicationScoped
public class KeycloakDeviceSessionsProvider implements IDeviceSessionsProvider {
    private static Logger logger = LoggerFactory.getLogger(KeycloakLinkedAccountsProvider.class);

    @Inject
    private ISecurityContext security;
    @Inject
    private HubConfiguration config;
    private CloseableHttpClient httpClient;

    @PostConstruct
    protected void postConstruct() {
        try {
            if (config.isDisableKeycloakTrustManager()) {
                SSLContext sslContext = SSLContexts.custom().loadTrustMaterial(null, new TrustSelfSignedStrategy()).build();
                SSLConnectionSocketFactory sslsf = new SSLConnectionSocketFactory(sslContext, NoopHostnameVerifier.INSTANCE);
                httpClient = HttpClients.custom().setSSLSocketFactory(sslsf).build();
            } else {
                httpClient = HttpClients.createSystem();
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Collection<DeviceSession> listDeviceSessions() throws IOException {
        String authServerRootUrl = config.getKeycloakAuthUrl();
        String realm = config.getKeycloakRealm();

        try {
            String externalUrl = KeycloakUriBuilder.fromUri(authServerRootUrl)
                    .path("/realms/{realm}/account/sessions/devices")
                    .build(realm).toString();
            String token = this.security.getToken();

            HttpGet get = new HttpGet(externalUrl);
            get.addHeader("Accept", "application/json");
            get.addHeader("Authorization", "Bearer " + token);

            try (CloseableHttpResponse response = httpClient.execute(get)) {
                if (response.getStatusLine().getStatusCode() != 200) {
                    logger.error("Failed to access Keycloak: {} - {}",
                            response.getStatusLine().getStatusCode(), response.getStatusLine().getReasonPhrase());
                    throw new IOException(
                            "Unexpected response from Keycloak: " + response.getStatusLine().getStatusCode() + "::"
                                    + response.getStatusLine().getReasonPhrase());
                }

                try (InputStream contentStream = response.getEntity().getContent()) {
                    String json = IOUtils.toString(contentStream, StandardCharsets.UTF_8);
                    return convertJsonToResponse(json);
                }
            }
        } catch (IllegalArgumentException e) {
            throw new IOException("Error getting linked account token.", e);
        }
    }

    public List<DeviceSession> convertJsonToResponse(String json) {
        JsonNode jsonTree = JsonUtil.toJsonTree(json);
        List<DeviceSession> deviceSessionList = new ArrayList<>();
        for (JsonNode jsonNode : jsonTree) {
            JsonNode sessionNodes = jsonNode.get("sessions");
            if (!sessionNodes.isArray() || sessionNodes.isEmpty()) {
                continue;
            }
            String os = jsonNode.get("os").asText();
            String osVersion = jsonNode.get("osVersion").asText();

            for (JsonNode sessionNode : sessionNodes) {
                DeviceSession item = new DeviceSession();

                item.setId(sessionNode.get("id").asText());
                item.setIpAddress(sessionNode.get("ipAddress").asText());
                item.setLastAccess(sessionNode.get("lastAccess").asLong());

                String browser = sessionNode.get("browser").asText();
                item.setName(String.format("%s / %s %s", browser, os, osVersion));

                boolean current = sessionNode.has("current") && sessionNode.get("current").asBoolean();
                item.setCurrent(current);

                deviceSessionList.add(item);
            }
        }
        deviceSessionList.sort(Comparator.comparingLong(DeviceSession::getLastAccess).reversed());
        return deviceSessionList;
    }
}
