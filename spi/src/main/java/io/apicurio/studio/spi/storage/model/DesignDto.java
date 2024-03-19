package io.apicurio.studio.spi.storage.model;

import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@Builder
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class DesignDto {

    private String id;

    private Long contentId;
}
