package io.apicurio.studio.service;

import io.apicurio.common.apps.content.handle.ContentHandle;
import io.apicurio.studio.spi.storage.StudioStorage;
import io.apicurio.studio.spi.storage.SearchQuerySpecification.SearchQuery;
import io.apicurio.studio.spi.storage.model.DesignMetadataDto;
import org.slf4j.Logger;

import java.time.Instant;
import java.util.List;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@ApplicationScoped
public class DesignService {

    @Inject
    StudioStorage storage;

    @Inject
    Logger log;

    public DesignMetadataDto createDesign(@NotNull DesignMetadataDto metadata, @NotNull ContentHandle content) {
        var now = Instant.now();
        var user = "user";
        metadata.setCreatedOn(now);
        metadata.setCreatedBy(user);
        metadata.setModifiedOn(now);
        metadata.setModifiedBy(user);
        return storage.createDesign(metadata, content);
    }

    public ContentHandle getDesignContent(@NotBlank String designId) {
        return storage.getDesignContent(designId);
    }

    public DesignMetadataDto updateDesignContent(@NotBlank String designId, @NotNull ContentHandle content) {
        // TODO Check if data changed?
        var metadata = storage.getDesignMetadata(designId);
        var now = Instant.now();
        var user = "user";
        metadata.setModifiedOn(now);
        metadata.setModifiedBy(user);
        storage.updateDesignMetadata(designId, metadata);
        return storage.updateDesignContent(designId, content);
    }

    public DesignMetadataDto getDesignMetadata(@NotBlank String designId) {
        return storage.getDesignMetadata(designId);
    }

    public DesignMetadataDto updateDesignMetadata(@NotBlank String designId, @NotNull DesignMetadataDto updatedMetadata) {
        var metadata = storage.getDesignMetadata(designId);
        if (!metadata.equals(updatedMetadata)) {
            var now = Instant.now();
            var user = "user";
            updatedMetadata.setModifiedOn(now);
            updatedMetadata.setModifiedBy(user);
            return storage.updateDesignMetadata(designId, updatedMetadata);
        } else {
            return metadata;
        }
    }

    public List<DesignMetadataDto> searchDesignMetadata(SearchQuery search) {
        return storage.searchDesignMetadata(search);
    }

    public long countDesigns() {
        return storage.countDesigns();
    }

    public void deleteDesign(@NotBlank String designId) {
        storage.deleteDesign(designId);
    }
}
