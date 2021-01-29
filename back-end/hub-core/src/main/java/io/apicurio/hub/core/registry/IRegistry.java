package io.apicurio.hub.core.registry;

import io.apicurio.registry.rest.beans.ArtifactMetaData;
import io.apicurio.registry.rest.beans.SearchedArtifact;

import java.io.IOException;
import java.util.Collection;

/**
 * This interface defines the possible actions the Apicurio Studio can perform on a configured Apicurio Registry
 * As of now, the Studio only gets artifacts and their related metadata / content
 * @author c.desc2@gmail.com
 */
public interface IRegistry {

    /**
     * Gets all the artifacts the configured registry instance can serve
     * @return a {@link Collection} of all the {@link SearchedArtifact} objects
     */
    Collection<SearchedArtifact> listArtifacts();

    /**
     * Gets the string resource represented in the configured registry by the given artifactId and artifactVersion
     * @param artifactId the artifactId
     * @param artifactVersion the artifactVersion
     * @return the artifact content
     * @throws IOException if the content could not be read as UTF_8
     */
    String getArtifact(String artifactId, Integer artifactVersion) throws IOException;

    /**
     * Gets the {@link ArtifactMetaData} for the given artifactId
     * @param artifactId the artifactId
     * @return the {@link ArtifactMetaData}
     */
    ArtifactMetaData getArtifactMetaData(String artifactId);
}
