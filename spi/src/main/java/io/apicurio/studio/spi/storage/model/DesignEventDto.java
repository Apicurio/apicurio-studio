package io.apicurio.studio.spi.storage.model;

import io.apicurio.common.apps.content.handle.ContentHandle;
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
public class DesignEventDto {

    private String id;

    private String designId;

    private String type;

    private Instant createdOn;

    private ContentHandle data;
}
