package io.apicurio.hub.api.security;

import io.apicurio.hub.api.beans.DeviceSession;
import io.apicurio.hub.core.util.JsonUtil;
import org.apache.commons.io.IOUtils;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Collection;

@ApplicationScoped
public class MockDeviceSessionsProvider implements IDeviceSessionsProvider {
    private static final Logger logger = LoggerFactory.getLogger(MockDeviceSessionsProvider.class);

    private static final String MOCK_URI = "https://microcks.djai.app/rest/DJAI+Device+Sessions/1.0.0/device-sessions";
    private CloseableHttpClient httpClient;

    @PostConstruct
    protected void postConstruct() {
        httpClient = HttpClients.createSystem();
    }
    @Override
    public Collection<DeviceSession> listDeviceSessions() throws IOException {
        HttpGet get = new HttpGet(MOCK_URI);
        get.addHeader("Accept", "application/json");
        try (CloseableHttpResponse response = httpClient.execute(get)) {
            if (response.getStatusLine().getStatusCode() != 200) {
                logger.debug("HTTP Response Status Code when access mock device-session: {}",
                        response.getStatusLine().getStatusCode());
            }
            try (InputStream contentStream = response.getEntity().getContent()) {
                String content = IOUtils.toString(contentStream, StandardCharsets.UTF_8);
                return Arrays.asList(JsonUtil.fromJson(content, DeviceSession[].class));
            }
        }
    }
}
