package io.apicurio.studio.service.model;

import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.Instant;

@Builder
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class SystemInfoDto {

    String name;

    String description;

    String version;

    String apiVersion;

    Instant builtOn;
}
