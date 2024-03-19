package io.apicurio.studio.rest.v1.impl;

import io.apicurio.common.apps.content.handle.ContentHandle;
import io.apicurio.studio.auth.Authorized;
import io.apicurio.studio.common.MediaTypes;
import io.apicurio.studio.rest.v1.DesignsResource;
import io.apicurio.studio.rest.v1.beans.CreateDesignEvent;
import io.apicurio.studio.rest.v1.beans.Design;
import io.apicurio.studio.rest.v1.beans.DesignEvent;
import io.apicurio.studio.rest.v1.beans.DesignOriginType;
import io.apicurio.studio.rest.v1.beans.DesignSearchResults;
import io.apicurio.studio.rest.v1.beans.EditableDesignMetadata;
import io.apicurio.studio.rest.v1.beans.SortBy;
import io.apicurio.studio.rest.v1.beans.SortOrder;
import io.apicurio.studio.rest.v1.impl.ex.BadRequestException;
import io.apicurio.studio.service.DesignEventService;
import io.apicurio.studio.service.DesignService;
import io.apicurio.studio.spi.storage.ResourceNotFoundStorageException;
import io.apicurio.studio.spi.storage.SearchQuerySpecification.SearchOrdering;
import io.apicurio.studio.spi.storage.SearchQuerySpecification.SearchQuery;
import io.apicurio.studio.spi.storage.model.DesignMetadataDto;

import java.io.InputStream;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.function.Consumer;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.ValidationException;
import jakarta.ws.rs.core.Response;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@ApplicationScoped
public class DesignsResourceImpl implements DesignsResource {

    @Inject
    DesignService designService;

    @Inject
    DesignEventService eventService;

    @Override
    @Authorized
    public DesignSearchResults getDesigns(String name, SortOrder order, SortBy orderby, String description,
                                          String type, BigInteger pageSize, BigInteger page) {
        // TODO Do we want to limit max page size?
        if (page != null && page.intValue() < 1) {
            throw new ValidationException("Page index must not be negative");
        }

        var search = new SearchQuery()
                .column("name", name)
                .column("description", description)
                .column("type", type);

        order = order != null ? order : SortOrder.desc;
        // TODO Write the default ordering in API spec
        // TODO Sort by modifiedOn (best for UI) or createdOn (best for more consistent processing)
        orderby = orderby != null ? orderby : SortBy.modifiedOn;
        search.orderBy(orderby.name(), order == SortOrder.desc ? SearchOrdering.DESC : SearchOrdering.ASC);

        page = page != null ? page : BigInteger.valueOf(1);
        pageSize = pageSize != null ? pageSize : BigInteger.valueOf(20);

        search.limit((page.intValue() - 1) * pageSize.intValue(), pageSize.intValue());
        // TODO: Move vvv to service layer
        var list = designService.searchDesignMetadata(search);
        int total = (int) designService.countDesigns(); // TODO Check cast
        return DesignSearchResults.builder()
                .kind("DesignSearchResults")
                .count(total)
                .page(page.intValue())
                .pageSize(pageSize.intValue())
                .designs(list.stream().map(this::convert).toList())
                .build();
    }

    /**
     * @see io.apicurio.studio.rest.v1.DesignsResource#createDesign(java.lang.String, java.lang.String, java.lang.String, io.apicurio.studio.rest.v1.beans.DesignOriginType, java.io.InputStream)
     */
    @Override
    @Authorized
    public Design createDesign(String xStudioName, String xStudioDescription, String xStudioType,
                               DesignOriginType xStudioOrigin, InputStream data) {

        BadRequestException.requireNotNullAnd(xStudioName, "Valid 'X-Studio-Name' header is required.", p -> !p.isBlank());
        BadRequestException.requireNotNullAnd(xStudioType, "Valid 'X-Studio-Type' header is required.", p -> !p.isBlank());
        BadRequestException.requireNotNullAnd(xStudioOrigin, "Valid 'X-Studio-Origin' header is required.", p -> true);

        if (xStudioName.startsWith("==")) {
            xStudioName = decodeHeaderValue(xStudioName);
        }
        if (xStudioDescription != null && xStudioDescription.startsWith("==")) {
            xStudioDescription = decodeHeaderValue(xStudioDescription);
        }

        var metadata = DesignMetadataDto.builder()
                .name(xStudioName)
                .description(xStudioDescription)
                .type(xStudioType)
                .origin(xStudioOrigin.name())
                .build();
        return convert(designService.createDesign(metadata, ContentHandle.create(data)));
    }

    @Override
    @Authorized
    public Response getDesign(String designId) {
        var content = designService.getDesignContent(designId);
        return Response.ok(content.string(), MediaTypes.BINARY).build();
    }

    @Override
    @Authorized
    public Design updateDesign(String designId, InputStream data) {
        return convert(designService.updateDesignContent(designId, ContentHandle.create(data)));
    }

    @Override
    @Authorized
    public void deleteDesign(String designId) {
        designService.deleteDesign(designId);
    }

    @Override
    @Authorized
    public Design getDesignMetadata(String designId) {
        return convert(designService.getDesignMetadata(designId));
    }

    @Override
    @Authorized
    public Design updateDesignMetadata(String designId, EditableDesignMetadata editableMetadata) {
        var metadata = designService.getDesignMetadata(designId);
        setIfNotNull(editableMetadata.getName(), metadata::setName);
        setIfNotNull(editableMetadata.getDescription(), metadata::setDescription);
        return convert(designService.updateDesignMetadata(designId, metadata));
    }

    /**
     * @see io.apicurio.studio.rest.v1.DesignsResource#getFirstEvent(java.lang.String)
     */
    @Override
    public DesignEvent getFirstEvent(String designId) {
        // TODO This endpoint feels really hacky. Use paging.
        return getAllDesignEvents(designId).stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundStorageException("There is no first event yet."));
    }

    private static String decodeHeaderValue(String encodedString) {
        if (encodedString.length() == 2) {
            return "";
        }
        byte[] decodedBytes = Base64.getDecoder().decode(encodedString.substring(2));
        return new String(decodedBytes, StandardCharsets.UTF_8);
    }

    private Design convert(DesignMetadataDto from) {
        return Design.builder()
                .id(from.getId())
                .kind("DesignMetadata")
                .href("/apis/studio/v1/designs/" + from.getId())
                .name(from.getName())
                .description(from.getDescription())
                .type(from.getType())
                .origin(DesignOriginType.fromValue(from.getOrigin()))
                .createdOn(Date.from(from.getCreatedOn()))
                .createdBy(from.getCreatedBy())
                .modifiedOn(Date.from(from.getModifiedOn()))
                .modifiedBy(from.getModifiedBy())
                .build();
    }

    private <T> void setIfNotNull(T data, Consumer<T> setter) {
        if (data != null) {
            setter.accept(data);
        }
    }

    /**
     * @see io.apicurio.studio.rest.v1.DesignsResource#getAllDesignEvents(java.lang.String)
     */
    @Override
    public List<DesignEvent> getAllDesignEvents(String designId) {
        return eventService.getAllDesignEvents(designId);
    }

    /**
     * @see io.apicurio.studio.rest.v1.DesignsResource#createDesignEvent(java.lang.String, io.apicurio.studio.rest.v1.beans.CreateDesignEvent)
     */
    @Override
    public DesignEvent createDesignEvent(String designId, CreateDesignEvent data) {
        return eventService.createDesignEvent(designId, data);
    }
}
