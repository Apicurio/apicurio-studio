package io.apicurio.studio.storage.common;

import io.apicurio.common.apps.config.DynamicConfigPropertyDto;
import io.apicurio.common.apps.config.impl.storage.DynamicConfigSqlStorageComponent;
import io.apicurio.common.apps.content.handle.ContentHandle;
import io.apicurio.common.apps.logging.LoggerProducer;
import io.apicurio.common.apps.storage.exceptions.StorageException;
import io.apicurio.common.apps.storage.exceptions.StorageExceptionMapper;
import io.apicurio.common.apps.storage.sql.SqlStorageComponent;
import io.apicurio.common.apps.storage.sql.jdbi.HandleFactory;
import io.apicurio.studio.spi.storage.SearchQuerySpecification.SearchQuery;
import io.apicurio.studio.spi.storage.StudioSqlStatements;
import io.apicurio.studio.spi.storage.StudioStorage;
import io.apicurio.studio.spi.storage.StudioStorageException;
import io.apicurio.studio.spi.storage.model.DesignCreatedEvent;
import io.apicurio.studio.spi.storage.model.DesignDto;
import io.apicurio.studio.spi.storage.model.DesignEventDto;
import io.apicurio.studio.spi.storage.model.DesignMetadataDto;
import io.apicurio.studio.spi.storage.model.OutboxEvent;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Event;
import jakarta.inject.Inject;
import jakarta.inject.Named;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;

import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import static io.apicurio.common.apps.storage.sql.jdbi.query.Sql.RESOURCE_CONTEXT_KEY;
import static io.apicurio.common.apps.storage.sql.jdbi.query.Sql.RESOURCE_IDENTIFIER_CONTEXT_KEY;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@ApplicationScoped
public class SqlStudioStorage extends SqlStorageComponent implements StudioStorage {

    @Inject
    LoggerProducer loggerProducer;

    protected static String CONTENT_SEQUENCE_KEY = "content";
    protected static String DESIGN_EVENT_SEQUENCE_KEY = "design_event";

    @Inject
    protected HandleFactory handles;

    @Inject
    @Named("apicurioSqlStatements")
    protected StudioSqlStatements sqlStatements;

    @Inject
    protected DynamicConfigSqlStorageComponent dynamicConfigSqlStorageComponent;

    @Inject
    protected StorageExceptionMapper exceptionMapper;

    @Inject
    Logger log;

    @Inject
    Event<OutboxEvent> storageEvent;

    @PostConstruct
    @Transactional
    protected void init() {
        start(loggerProducer, handles, SqlStorageComponent.Configuration.builder()
                .sqlStatements(sqlStatements)
                .supportsAtomicSequenceIncrement(!Objects.equals(sqlStatements.dbType(), "h2"))
                .ddlDirRootPath("META-INF/storage/schema")
                .build());

        dynamicConfigSqlStorageComponent.start(loggerProducer, handles, sqlStatements);
    }

    @Override
    public boolean isReady() {
        return true;
    }

    @Override
    @Transactional
    public DesignMetadataDto createDesign(DesignMetadataDto metadata, ContentHandle content) {

        // Create Content
        // TODO Deduplication
        var contentId = exceptionMapper.with(() ->
                nextSequenceValue(CONTENT_SEQUENCE_KEY)
        );
        handles.withHandleNoExceptionMapped(handle ->
                handle.createUpdate(sqlStatements.insertDesignContent())
                        .setContext(RESOURCE_CONTEXT_KEY, "content")
                        .setContext(RESOURCE_IDENTIFIER_CONTEXT_KEY, String.valueOf(contentId))
                        .bind(0, contentId) // TODO Nested handle
                        .bind(1, content.getSha256Hash())
                        .bind(2, content)
                        .execute()
        );

        // Create Design
        var designId = UUID.randomUUID().toString();
        handles.withHandleNoExceptionMapped(handle ->
                handle.createUpdate(sqlStatements.insertDesign())
                        .setContext(RESOURCE_CONTEXT_KEY, "design")
                        .setContext(RESOURCE_IDENTIFIER_CONTEXT_KEY, designId)
                        .bind(0, designId)
                        .bind(1, contentId)
                        .execute()
        );

        // Create Metadata
        metadata.setId(designId);
        metadata.setCreatedBy("TODO");
        metadata.setCreatedOn(Instant.now());
        metadata.setModifiedBy(metadata.getCreatedBy());
        metadata.setModifiedOn(metadata.getCreatedOn());
        handles.withHandleNoExceptionMapped(handle ->
                handle.createUpdate(sqlStatements.insertMetadata())
                        .setContext(RESOURCE_CONTEXT_KEY, "design metadata")
                        .setContext(RESOURCE_IDENTIFIER_CONTEXT_KEY, metadata.getId())
                        .bind(0, metadata.getId())
                        .bind(1, metadata.getName())
                        .bind(2, metadata.getDescription())
                        .bind(3, metadata.getCreatedBy())
                        .bind(4, metadata.getCreatedOn())
                        .bind(5, metadata.getModifiedBy())
                        .bind(6, metadata.getModifiedOn())
                        .bind(7, metadata.getType())
                        .bind(8, metadata.getOrigin())
                        .execute()
        );

        //Once done, fire the appropriate event
        storageEvent.fire(DesignCreatedEvent.of(metadata));

        return metadata;
    }

    @Override
    @Transactional
    public ContentHandle getDesignContent(String designId) {
        return handles.withHandleNoExceptionMapped(handle ->
                handle.createQuery(sqlStatements.selectContentByDesignId())
                        .setContext(RESOURCE_CONTEXT_KEY, "content")
                        .setContext(RESOURCE_IDENTIFIER_CONTEXT_KEY, designId)
                        .bind(0, designId)
                        .mapTo(ContentHandle.class)
                        .one()
        );
    }

    @Override
    @Transactional
    public DesignMetadataDto updateDesignContent(String designId, ContentHandle content) {
        return handles.withHandleNoExceptionMapped(handle -> {

            handle.createUpdate(sqlStatements.updateContentByDesignId())
                    .setContext(RESOURCE_CONTEXT_KEY, "content")
                    .setContext(RESOURCE_IDENTIFIER_CONTEXT_KEY, designId)
                    .bind(0, content)
                    .bind(1, designId)
                    .execute();

            // TODO Touch Operation
            var metadata = getDesignMetadata(designId);
            updateDesignMetadata(designId, metadata);

            return metadata;
        });
    }

    @Override
    @Transactional
    public DesignMetadataDto getDesignMetadata(String designId) {
        return handles.withHandleNoExceptionMapped(handle ->
                handle.createQuery(sqlStatements.selectDesignMetadata())
                        .setContext(RESOURCE_CONTEXT_KEY, "content")
                        .setContext(RESOURCE_IDENTIFIER_CONTEXT_KEY, designId)
                        .bind(0, designId)
                        .mapTo(DesignMetadataDto.class)
                        .one()
        );
    }

    @Override
    @Transactional
    public DesignMetadataDto updateDesignMetadata(String designId, DesignMetadataDto metadata) {
        return handles.withHandleNoExceptionMapped(handle -> {

            metadata.setModifiedBy("TODO");
            metadata.setModifiedOn(Instant.now());

            handle.createUpdate(sqlStatements.updateDesignMetadata())
                    .setContext(RESOURCE_CONTEXT_KEY, "design metadata")
                    .setContext(RESOURCE_IDENTIFIER_CONTEXT_KEY, metadata.getId())
                    .bind(0, metadata.getName())
                    .bind(1, metadata.getDescription())
                    .bind(2, metadata.getCreatedBy())
                    .bind(3, metadata.getCreatedOn())
                    .bind(4, metadata.getModifiedBy())
                    .bind(5, metadata.getModifiedOn())
                    .bind(6, metadata.getType())
                    .bind(7, metadata.getOrigin())
                    .bind(8, metadata.getId())
                    .execute();

            return metadata;
        });
    }

    @Override
    @Transactional
    public List<DesignMetadataDto> searchDesignMetadata(SearchQuery search) {
        var spec = sqlStatements.searchDesignMetadataSpecification();

        spec.apply(search);
        log.warn("Search: {}", sqlStatements.searchDesignMetadata(spec));

        return handles.withHandleNoExceptionMapped(handle -> {
            var q = handle.createQuery(sqlStatements.searchDesignMetadata(spec))
                    .setContext(RESOURCE_CONTEXT_KEY, "design metadata");

            spec.bindWhere(0, q);

            return q.mapTo(DesignMetadataDto.class)
                    .list();
        });
    }

    @Override
    @Transactional
    public long countDesigns() {
        return handles.withHandleNoExceptionMapped(handle ->
                handle.createQuery(sqlStatements.countDesigns())
                        .setContext(RESOURCE_CONTEXT_KEY, "design")
                        .mapTo(Long.class)
                        .one()
        );
    }

    @Override
    @Transactional
    public void deleteDesign(String designId) {
        var design = getDesign(designId);
        try {
            handles.withHandle(handle ->
                    handle.createUpdate(sqlStatements.deleteDesign())
                            .setContext(RESOURCE_CONTEXT_KEY, "design")
                            .setContext(RESOURCE_IDENTIFIER_CONTEXT_KEY, designId)
                            .bind(0, designId)
                            .execute()
            );
            handles.withHandle(handle ->
                    handle.createUpdate(sqlStatements.deleteDesignMetadata())
                            .setContext(RESOURCE_CONTEXT_KEY, "design metadata")
                            .setContext(RESOURCE_IDENTIFIER_CONTEXT_KEY, designId)
                            .bind(0, designId)
                            .execute()
            );
            handles.withHandle(handle ->
                    handle.createUpdate(sqlStatements.deleteDesignContent())
                            .setContext(RESOURCE_CONTEXT_KEY, "content")
                            .setContext(RESOURCE_IDENTIFIER_CONTEXT_KEY, String.valueOf(design.getContentId()))
                            .bind(0, design.getContentId())
                            .execute()
            );
        } catch (StorageException ex) {
            throw new StudioStorageException("Could not delete design with ID " + designId + ".", ex);
        }
    }

    @Transactional
    public DesignDto getDesign(String designId) {
        return handles.withHandleNoExceptionMapped(handle ->
                handle.createQuery(sqlStatements.selectDesign())
                        .setContext(RESOURCE_CONTEXT_KEY, "design")
                        .setContext(RESOURCE_IDENTIFIER_CONTEXT_KEY, designId)
                        .bind(0, designId)
                        .mapTo(DesignDto.class)
                        .one()
        );
    }

    @Override
    public DynamicConfigPropertyDto getConfigProperty(String name) {
        return dynamicConfigSqlStorageComponent.getConfigProperty(name);
    }

    @Override
    public void setConfigProperty(DynamicConfigPropertyDto dynamicConfigPropertyDto) {
        dynamicConfigSqlStorageComponent.setConfigProperty(dynamicConfigPropertyDto);
    }

    @Override
    public void deleteConfigProperty(String name) {
        dynamicConfigSqlStorageComponent.deleteConfigProperty(name);
    }

    @Override
    public List<DynamicConfigPropertyDto> getConfigProperties() {
        return dynamicConfigSqlStorageComponent.getConfigProperties();
    }

    @Override
    @Transactional
    public DesignEventDto createDesignEvent(DesignEventDto event) {
        var eventId = exceptionMapper.with(() ->
                nextSequenceValue(DESIGN_EVENT_SEQUENCE_KEY)
        );
        event.setId(String.valueOf(eventId));
        event.setCreatedOn(Instant.now());
        handles.withHandleNoExceptionMapped(handle ->

                handle.createUpdate(sqlStatements.insertDesignEvent())
                        .setContext(RESOURCE_CONTEXT_KEY, "design event")
                        .setContext(RESOURCE_IDENTIFIER_CONTEXT_KEY, event.getId())
                        .bind(0, event.getId())
                        .bind(1, event.getDesignId())
                        .bind(2, event.getCreatedOn())
                        .bind(3, event.getType())
                        .bind(4, event.getData())
                        .execute()
        );
        return event;
    }

    @Override
    public List<DesignEventDto> getDesignEvents(String designId) {
        return handles.withHandleNoExceptionMapped(handle ->

                handle.createQuery(sqlStatements.selectDesignEvents())
                        .setContext(RESOURCE_CONTEXT_KEY, "design event")
                        .bind(0, designId)
                        .mapTo(DesignEventDto.class)
                        .list()
        );
    }

    @Override
    public OutboxEvent createEvent(OutboxEvent event) {
        // Create Design
        handles.withHandleNoExceptionMapped(handle ->
                handle.createUpdate(sqlStatements.createOutboxEvent())
                        .setContext(RESOURCE_CONTEXT_KEY, "outbox")
                        .setContext(RESOURCE_IDENTIFIER_CONTEXT_KEY, event.getAggregateId())
                        .bind(0, event.getId())
                        .bind(1, event.getAggregateType())
                        .bind(2, event.getAggregateId())
                        .bind(3, event.getType())
                        .bind(4, event.getPayload().toString())
                        .execute()
        );

        return event;
    }

    @Override
    public void deleteEvent(String eventId) {
        try {
            handles.withHandle(handle ->
                    handle.createUpdate(sqlStatements.deleteOutboxEvent())
                            .setContext(RESOURCE_CONTEXT_KEY, "outbox")
                            .setContext(RESOURCE_IDENTIFIER_CONTEXT_KEY, eventId)
                            .bind(0, eventId)
                            .execute()
            );
        }
        catch (StorageException ex) {
            throw new StudioStorageException("Could not delete outbox event with ID " + eventId + ".", ex);
        }
    }
}
