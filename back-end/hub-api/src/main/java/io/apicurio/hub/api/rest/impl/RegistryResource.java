package io.apicurio.hub.api.rest.impl;

import io.apicurio.hub.api.content.ContentDereferencer;
import io.apicurio.hub.api.metrics.IApiMetrics;
import io.apicurio.hub.api.rest.IRegistryResource;
import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.exceptions.ServerError;
import io.apicurio.hub.core.registry.IRegistry;
import io.apicurio.registry.rest.beans.ArtifactMetaData;
import io.apicurio.registry.rest.beans.SearchedArtifact;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collection;

/**
 * @author c.desc2@gmail.com
 */
@ApplicationScoped
public class RegistryResource implements IRegistryResource {

    @Inject
    private ContentDereferencer dereferencer;
    @Inject
    private IApiMetrics metrics;
    @Inject
    private IRegistry registry;

    @Override
    public Collection<SearchedArtifact> listArtifacts() {
        metrics.apiCall("/registry", "GET");
        return registry.listArtifacts();
    }

    @Override
    public ArtifactMetaData getArtifact(String artifactId) {
        metrics.apiCall("/registry/{artifactId}", "GET");
        return registry.getArtifactMetaData(artifactId);
    }

    @Override
    public Response getContent(String artifactId, Integer artifactVersion, String dereference) throws ServerError, NotFoundException {
        metrics.apiCall("/registry/{artifactId}/{artifactVersion}/content", "GET");
        try {
            String content = registry.getArtifact(artifactId, artifactVersion);
            if ("true".equalsIgnoreCase(dereference)) {
                content = dereferencer.dereference(content);
            }
            byte[] bytes = content.getBytes(StandardCharsets.UTF_8);
            String cl = String.valueOf(bytes.length);
            Response.ResponseBuilder builder = Response.ok().entity(content)
                    .header("Content-Type", "application/json; charset=" + StandardCharsets.UTF_8)
                    .header("Content-Length", cl);
            return builder.build();
        } catch (IOException e) {
            throw new ServerError(e);
        }
    }
}
