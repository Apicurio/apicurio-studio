package io.apicurio.studio.rest.v1.impl;

import io.apicurio.studio.rest.v1.SystemResource;
import io.apicurio.studio.rest.v1.beans.SystemInfo;
import io.apicurio.studio.service.SystemService;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.util.Date;
import java.util.Optional;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@ApplicationScoped
public class SystemResourceImpl implements SystemResource {

    @Inject
    SystemService systemService;

    @ConfigProperty(name = "app.git.commit-id")
    Optional<String> commitIdFull;

    @Override
    public SystemInfo getSystemInfo() {
        // TODO Caching...
        var from = systemService.getSystemInfo();
        return SystemInfo.builder()
                .name(from.getName())
                .description(from.getDescription())
                .version(from.getVersion())
                .apiVersion(from.getApiVersion())
                .builtOn(Date.from(from.getBuiltOn()))
                .gitCommitId(commitIdFull.orElse(null))
                .build();
    }
}
