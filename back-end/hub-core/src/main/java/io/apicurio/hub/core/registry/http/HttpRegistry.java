package io.apicurio.hub.core.registry.http;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.apicurio.hub.core.config.HubConfiguration;
import io.apicurio.hub.core.registry.IRegistry;
import io.apicurio.registry.rest.beans.ArtifactMetaData;
import io.apicurio.registry.rest.beans.ArtifactSearchResults;
import io.apicurio.registry.rest.beans.SearchedArtifact;
import org.apache.commons.io.IOUtils;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.entity.ContentType;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Default;
import javax.inject.Inject;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@ApplicationScoped
@Default
public class HttpRegistry implements IRegistry {

    private static final Logger logger = LoggerFactory.getLogger(HttpRegistry.class);
    private static CloseableHttpClient httpClient = HttpClients.createDefault();
    private static final ObjectMapper mapper = new ObjectMapper();

    @Inject
    private HubConfiguration config;
    
    @Override
    public Collection<SearchedArtifact> listArtifacts() throws IOException {
        List<SearchedArtifact> artifactMetaDataList = Collections.emptyList();
        if (config.getRegistryUrl() != null) {
            HttpGet get = new HttpGet(String.format("%s/api/search/artifacts", config.getRegistryUrl()));
            try (CloseableHttpResponse response = httpClient.execute(get)) {
                if (response.getStatusLine().getStatusCode() >= 200 && response.getStatusLine().getStatusCode() < 300) {
                    try (InputStream contentStream = response.getEntity().getContent()) {
                        final ArtifactSearchResults artifactSearchResults = mapper.readValue(contentStream, ArtifactSearchResults.class);
                        artifactMetaDataList = artifactSearchResults.getArtifacts();
                    }
                }
            }
        }
        return artifactMetaDataList;
    }

    @Override
    public String getArtifact(String artifactId, Integer artifactVersion) throws IOException {
        String content = "";
        if (config.getRegistryUrl() != null) {
            StringBuilder urlBuilder = new StringBuilder();
            urlBuilder.append(config.getRegistryUrl())
                    .append("/api/artifacts/").append(artifactId);
            if (artifactVersion != null) {
                urlBuilder.append("/versions/").append(artifactVersion);
            }
            HttpGet get = new HttpGet(urlBuilder.toString());
            try (CloseableHttpResponse response = httpClient.execute(get)) {
                if (response.getStatusLine().getStatusCode() >= 200 && response.getStatusLine().getStatusCode() < 300) {
                    try (InputStream contentStream = response.getEntity().getContent()) {
                        ContentType ct = ContentType.getOrDefault(response.getEntity());
                        String encoding = StandardCharsets.UTF_8.name();
                        if (ct != null && ct.getCharset() != null) {
                            encoding = ct.getCharset().name();
                        }
                        content = IOUtils.toString(contentStream, encoding);
                    }
                }
            }
        }
        return content;
    }

    @Override
    public ArtifactMetaData getArtifactMetaData(String artifactId) throws IOException {
        ArtifactMetaData metadata = null;
        if (config.getRegistryUrl() != null) {
            HttpGet get = new HttpGet(String.format("%s/api/artifacts/%s/meta", config.getRegistryUrl(), artifactId));
            try (CloseableHttpResponse response = httpClient.execute(get)) {
                if (response.getStatusLine().getStatusCode() >= 200 && response.getStatusLine().getStatusCode() < 300) {
                    try (InputStream contentStream = response.getEntity().getContent()) {
                        metadata = mapper.readValue(contentStream, ArtifactMetaData.class);
                    }
                }
            }
        }
        return metadata;
    }

}
