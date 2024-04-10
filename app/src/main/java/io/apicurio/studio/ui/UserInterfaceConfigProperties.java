/*
 * Copyright 2024 Red Hat Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.apicurio.studio.ui;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import io.apicurio.common.apps.config.Info;
import jakarta.inject.Singleton;

/**
 * @author eric.wittmann@gmail.com
 */
@Singleton
public class UserInterfaceConfigProperties {

    @ConfigProperty(name = "apicurio.ui.context-path", defaultValue = "/")
    @Info(category = "ui", description = "Context path of the UI", availableSince = "1.0.0")
    public String contextPath;

    @ConfigProperty(name = "apicurio.ui.nav-prefix-path", defaultValue = "_")
    @Info(category = "ui", description = "Navigation prefix for all UI paths", availableSince = "1.0.0")
    public String navPrefixPath;
    
    
    @ConfigProperty(name = "quarkus.oidc.tenant-enabled", defaultValue = "false")
    @Info(category = "auth", description = "OIDC authentication enabled", availableSince = "1.0.0")
    public Boolean authOidcTenantEnabled;

    @ConfigProperty(name = "quarkus.oidc.enabled", defaultValue = "false")
    @Info(category = "auth", description = "OIDC enabled", availableSince = "1.0.0")
    public Boolean authOidcEnabled;

    @ConfigProperty(name = "quarkus.oidc.auth-server-url", defaultValue = "")
    @Info(category = "auth", description = "OIDC auth server URL", availableSince = "1.0.0")
    public String authOidcUrl;

    @ConfigProperty(name = "apicurio.ui.auth.oidc.redirect-uri", defaultValue = "/")
    @Info(category = "ui", description = "The user interface OIDC redirectUri", availableSince = "1.0.0")
    public String authOidcRedirectUri;

    @ConfigProperty(name = "apicurio.ui.auth.oidc.client-id", defaultValue = "apicurio-studio-ui")
    @Info(category = "ui", description = "The user interface OIDC clientId", availableSince = "1.0.0")
    public String authOidcClientId;

    
    @ConfigProperty(name = "apicurio.ui.masthead.enabled", defaultValue = "true")
    @Info(category = "ui", description = "Enabled to show the masthead", availableSince = "1.0.0")
    public Boolean mastheadEnabled;

    @ConfigProperty(name = "apicurio.ui.masthead.label", defaultValue = "APICURIO STUDIO")
    @Info(category = "ui", description = "The masthead label (shown if the logo does not render)", availableSince = "1.0.0")
    public String mastheadLabel;

    @ConfigProperty(name = "apicurio.ui.editors.url", defaultValue = "/editors/")
    @Info(category = "ui", description = "URL to the 'editors' UI component", availableSince = "1.0.0")
    public String editorsUrl;
}
