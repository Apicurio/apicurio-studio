package io.apicurio.studio.service;

import io.apicurio.common.apps.core.System;
import io.apicurio.studio.service.model.SystemInfoDto;

import java.time.Instant;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@ApplicationScoped
public class SystemService {

    @Inject
    System system;

    public SystemInfoDto getSystemInfo() {
        return SystemInfoDto.builder()
                .name(system.getName())
                .description(system.getDescription())
                .version(system.getVersion())
                .apiVersion("v0")
                .builtOn(Instant.now()) // TODO
                .build();
    }
}
