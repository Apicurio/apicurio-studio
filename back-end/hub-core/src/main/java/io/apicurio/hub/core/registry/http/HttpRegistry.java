package io.apicurio.hub.core.registry.http;

import io.apicurio.hub.core.config.HubConfiguration;
import io.apicurio.hub.core.registry.IRegistry;
import io.apicurio.registry.client.RegistryRestClient;
import io.apicurio.registry.client.RegistryRestClientFactory;
import io.apicurio.registry.rest.beans.ArtifactMetaData;
import io.apicurio.registry.rest.beans.ArtifactSearchResults;
import io.apicurio.registry.rest.beans.SearchedArtifact;
import org.apache.commons.io.IOUtils;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Default;
import javax.inject.Inject;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
@Default
public class HttpRegistry implements IRegistry {

    private final RegistryRestClient registryRestClient;

    @Inject
    public HttpRegistry(HubConfiguration config) {
        this.registryRestClient = Optional.ofNullable(config.getRegistryApiUrl())
                .map(RegistryRestClientFactory::create)
                .orElse(null);
    }

    @Override
    public Collection<SearchedArtifact> listArtifacts() {
        List<SearchedArtifact> artifactMetaDataList = Collections.emptyList();
        if (registryRestClient != null) {
            final ArtifactSearchResults artifactSearchResults = registryRestClient.searchArtifacts(null, null, null, null, null);
            artifactMetaDataList = artifactSearchResults.getArtifacts();
        }
        return artifactMetaDataList;
    }

    @Override
    public String getArtifact(String artifactId, Integer artifactVersion) throws IOException {
        String content = "";
        if (registryRestClient != null) {
            try (InputStream contentStream = registryRestClient.getArtifactVersion(artifactId, artifactVersion)) {
                String encoding = StandardCharsets.UTF_8.name();
                content = IOUtils.toString(contentStream, encoding);
            }
        }
        return content;
    }

    @Override
    public ArtifactMetaData getArtifactMetaData(String artifactId) {
        ArtifactMetaData metadata = null;
        if (registryRestClient != null) {
            metadata = registryRestClient.getArtifactMetaData(artifactId);
        }
        return metadata;
    }

}
