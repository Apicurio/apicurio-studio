package io.apicurio.studio.rest.v1.impl;

import java.io.InputStream;
import java.math.BigInteger;
import java.util.Date;
import java.util.List;
import java.util.function.Consumer;

import io.apicurio.common.apps.content.handle.ContentHandle;
import io.apicurio.studio.auth.Authorized;
import io.apicurio.studio.common.MediaTypes;
import io.apicurio.studio.rest.v1.DesignsResource;
import io.apicurio.studio.rest.v1.beans.CreateDesign;
import io.apicurio.studio.rest.v1.beans.CreateDesignEvent;
import io.apicurio.studio.rest.v1.beans.Design;
import io.apicurio.studio.rest.v1.beans.DesignEvent;
import io.apicurio.studio.rest.v1.beans.DesignOriginType;
import io.apicurio.studio.rest.v1.beans.DesignSearchResults;
import io.apicurio.studio.rest.v1.beans.DesignType;
import io.apicurio.studio.rest.v1.beans.EditableDesignMetadata;
import io.apicurio.studio.rest.v1.beans.SortBy;
import io.apicurio.studio.rest.v1.beans.SortOrder;
import io.apicurio.studio.service.DesignEventService;
import io.apicurio.studio.service.DesignService;
import io.apicurio.studio.spi.storage.ResourceNotFoundStorageException;
import io.apicurio.studio.spi.storage.SearchQuerySpecification.SearchOrdering;
import io.apicurio.studio.spi.storage.SearchQuerySpecification.SearchQuery;
import io.apicurio.studio.spi.storage.model.DesignMetadataDto;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.ValidationException;
import jakarta.validation.constraints.NotNull;
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
     * @see io.apicurio.studio.rest.v1.DesignsResource#createDesign(io.apicurio.studio.rest.v1.beans.CreateDesign)
     */
    @Override
    @Authorized
    public Design createDesign(@NotNull CreateDesign data) {
        var metadata = DesignMetadataDto.builder()
                .name(data.getName())
                .description(data.getDescription())
                .type(data.getType().value())
                .origin(data.getOrigin().value())
                .build();
        return convert(designService.createDesign(metadata, ContentHandle.create(data.getContent())));
    }

    /**
     * @see io.apicurio.studio.rest.v1.DesignsResource#getDesignContent(java.lang.String)
     */
    @Override
    @Authorized
    public Response getDesignContent(String designId) {
        var content = designService.getDesignContent(designId);
        return Response.ok(content.string(), MediaTypes.BINARY).build();
    }

    /**
     * @see io.apicurio.studio.rest.v1.DesignsResource#updateDesignContent(java.lang.String, java.io.InputStream)
     */
    @Override
    @Authorized
    public Design updateDesignContent(String designId, @NotNull InputStream data) {
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

    private Design convert(DesignMetadataDto from) {
        return Design.builder()
                .designId(from.getId())
                .name(from.getName())
                .description(from.getDescription())
                .type(DesignType.valueOf(from.getType()))
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
