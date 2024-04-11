package io.apicurio.studio.rest.v1.impl;

import java.io.InputStream;
import java.net.URL;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.apicurio.studio.StudioAppException;
import io.apicurio.studio.rest.v1.SystemResource;
import io.apicurio.studio.rest.v1.beans.OpenApiVendorExtension;
import io.apicurio.studio.rest.v1.beans.SystemInfo;
import io.apicurio.studio.rest.v1.beans.UserInterfaceConfig;
import io.apicurio.studio.rest.v1.beans.UserInterfaceConfigAuth;
import io.apicurio.studio.rest.v1.beans.UserInterfaceConfigComponents;
import io.apicurio.studio.rest.v1.beans.UserInterfaceConfigComponentsEditors;
import io.apicurio.studio.rest.v1.beans.UserInterfaceConfigComponentsMasthead;
import io.apicurio.studio.rest.v1.beans.UserInterfaceConfigUi;
import io.apicurio.studio.service.SystemService;
import io.apicurio.studio.ui.UserInterfaceConfigProperties;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@ApplicationScoped
public class SystemResourceImpl implements SystemResource {

    @Inject
    SystemService systemService;
    
    @Inject
    UserInterfaceConfigProperties uiConfig;

    @ConfigProperty(name = "apicurio.app.git.commit-id")
    Optional<String> commitIdFull;
    
    private List<OpenApiVendorExtension> openApiVendorExtensionCache;

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

    /**
     * @see io.apicurio.studio.rest.v1.SystemResource#getUIConfig()
     */
    @Override
    public UserInterfaceConfig getUIConfig() {
        return UserInterfaceConfig.builder()
                .ui(UserInterfaceConfigUi.builder()
                        .contextPath(uiConfig.contextPath)
                        .navPrefixPath(uiConfig.navPrefixPath.equals("_") ? "" : uiConfig.navPrefixPath)
                        .build())
                .auth(uiAuthConfig())
                .components(UserInterfaceConfigComponents.builder()
                        .masthead(UserInterfaceConfigComponentsMasthead.builder()
                                .show(uiConfig.mastheadEnabled)
                                .label(uiConfig.mastheadLabel)
                                .build())
                        .editors(UserInterfaceConfigComponentsEditors.builder()
                                .url(uiConfig.editorsUrl)
                                .build())
                        .build())
                .build();
    }

    private UserInterfaceConfigAuth uiAuthConfig() {
        boolean oidcEnabled = uiConfig.authOidcEnabled && uiConfig.authOidcTenantEnabled;

        UserInterfaceConfigAuth rval = new UserInterfaceConfigAuth();
        rval.setType(oidcEnabled ? UserInterfaceConfigAuth.Type.oidc : UserInterfaceConfigAuth.Type.none);
        if (oidcEnabled) {
            Map<String, String> options = new HashMap<>();
            options.put("url", uiConfig.authOidcUrl);
            options.put("redirectUri", uiConfig.authOidcRedirectUri);
            options.put("clientId", uiConfig.authOidcClientId);
            rval.setOptions(options);
        }
        return rval;
    }
    
    /**
     * @see io.apicurio.studio.rest.v1.SystemResource#getOpenApiVendorExtensions()
     */
    @Override
    public List<OpenApiVendorExtension> getOpenApiVendorExtensions() {
        if (!this.uiConfig.openApiVendorExtensions.isPresent()) {
            return Collections.emptyList();
        }

        if (openApiVendorExtensionCache == null) {
            try {
                URL url = new URL(uiConfig.openApiVendorExtensions.get());
                try (InputStream stream = url.openStream()) {
                    ObjectMapper mapper = new ObjectMapper();
                    openApiVendorExtensionCache = mapper.readerForListOf(OpenApiVendorExtension.class).readValue(stream);
                }
            } catch (Exception e) {
                throw new StudioAppException("Error loading configured OpenAPI vendor extensions.", e);
            }
        }
        return openApiVendorExtensionCache;
    }
}
