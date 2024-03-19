package io.apicurio.studio.spi.storage.model;

import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.Instant;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@Builder
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class DesignMetadataDto {

    private String id;

    private String name;

    private String description;

    private String type;

    private String origin;

    private Instant createdOn;

    private String createdBy;

    private Instant modifiedOn;

    private String modifiedBy;
}
