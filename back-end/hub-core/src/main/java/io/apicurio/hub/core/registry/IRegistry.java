package io.apicurio.hub.core.registry;

import io.apicurio.registry.rest.beans.ArtifactMetaData;
import io.apicurio.registry.rest.beans.SearchedArtifact;

import java.io.IOException;
import java.util.Collection;

public interface IRegistry {
    Collection<SearchedArtifact> listArtifacts() throws IOException;

    String getArtifact(String artifactId, Integer artifactVersion) throws IOException;

    ArtifactMetaData getArtifactMetaData(String artifactId) throws IOException;
}
