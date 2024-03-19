package io.apicurio.studio.spi.storage;

import io.apicurio.common.apps.config.DynamicConfigStorage;
import io.apicurio.common.apps.content.handle.ContentHandle;
import io.apicurio.studio.spi.storage.SearchQuerySpecification.SearchQuery;
import io.apicurio.studio.spi.storage.model.DesignEventDto;
import io.apicurio.studio.spi.storage.model.DesignMetadataDto;

import java.util.List;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
public interface StudioStorage extends DynamicConfigStorage {

    DesignMetadataDto createDesign(DesignMetadataDto metadata, ContentHandle content);

    ContentHandle getDesignContent(String designId);

    DesignMetadataDto updateDesignContent(String designId, ContentHandle content);

    DesignMetadataDto getDesignMetadata(String designId);

    DesignMetadataDto updateDesignMetadata(String designId, DesignMetadataDto metadata);

    List<DesignMetadataDto> searchDesignMetadata(SearchQuery search);

    long countDesigns();

    void deleteDesign(String designId);

    DesignEventDto createDesignEvent(DesignEventDto event);

    List<DesignEventDto> getDesignEvents(String designId);
}
