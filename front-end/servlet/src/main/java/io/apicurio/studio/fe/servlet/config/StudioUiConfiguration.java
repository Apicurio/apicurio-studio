/*
 * Copyright 2017 JBoss Inc
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

package io.apicurio.studio.fe.servlet.config;

import javax.enterprise.context.ApplicationScoped;

import io.apicurio.studio.fe.servlet.servlets.KeycloakDownloadServlet;
import io.apicurio.studio.shared.config.Configuration;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class StudioUiConfiguration extends Configuration {

    private static final String HUB_API_URL_ENV = "APICURIO_UI_HUB_API_URL";
    private static final String HUB_API_URL_SYSPROP = "apicurio-ui.hub-api.url";

    private static final String HUB_API_DISABLE_API_TRUST_ENV = "APICURIO_UI_HUB_API_DISABLE_TRUST_MANAGER";
    private static final String HUB_API_DISABLE_API_TRUST_SYSPROP = "apicurio-ui.hub-api.disable-trust-manager";

    private static final String LOGOUT_REDIRECT_URI_ENV = "APICURIO_UI_LOGOUT_REDIRECT_URI";
    private static final String LOGOUT_REDIRECT_URI_SYSPROP = "apicurio-ui.logout-redirect-uri";

    private static final String EDITING_URL_ENV = "APICURIO_UI_EDITING_URL";
    private static final String EDITING_URL_SYSPROP = "apicurio-ui.editing.url";
    
    private static final String HUB_UI_URL_ENV = "APICURIO_UI_HUB_UI_URL";
    private static final String HUB_UI_URL_SYSPROP = "apicurio-ui.url";

    private static final String FEATURE_MICROCKS_ENV = "APICURIO_UI_FEATURE_MICROCKS";
    private static final String FEATURE_MICROCKS_SYSPROP = "apicurio-ui.feature.microcks";

    private static final String FEATURE_ASYNCAPI_ENV = "APICURIO_UI_FEATURE_ASYNCAPI";
    private static final String FEATURE_ASYNCAPI_SYSPROP = "apicurio-ui.feature.asyncapi";

    private static final String FEATURE_GRAPHQL_ENV = "APICURIO_UI_FEATURE_GRAPHQL";
    private static final String FEATURE_GRAPHQL_SYSPROP = "apicurio-ui.feature.graphql";

    private static final String FEATURE_SHARE_WITH_EVERYONE_ENV = "APICURIO_UI_FEATURE_SHARE_WITH_EVERYONE";
    private static final String FEATURE_SHARE_WITH_EVERYONE_SYSPROP = "apicurio-ui.feature.shareWithEveryone";

    /**
     * Returns the URL of the Apicurio Hub API.
     */
    public String getHubApiUrl() {
        return getConfigurationProperty(HUB_API_URL_ENV, HUB_API_URL_SYSPROP, null);
    }

    /**
     * Returns the URL of the Apicurio Editing API.
     */
    public String getEditingUrl() {
        return getConfigurationProperty(EDITING_URL_ENV, EDITING_URL_SYSPROP, null);
    }

    /**
     * Returns the URI of where to redirect after the user logs out of the application.
     */
    public String getLogoutRedirectUri() {
        return getConfigurationProperty(LOGOUT_REDIRECT_URI_ENV, LOGOUT_REDIRECT_URI_SYSPROP, "/studio");
    }

    /**
     * Returns true if the trust manager should be disabled when making server-server API calls
     * to the Hub API.  This happens, for example, in the {@link KeycloakDownloadServlet}.
     */
    public boolean isDisableHubApiTrustManager() {
        return "true".equals(getConfigurationProperty(HUB_API_DISABLE_API_TRUST_ENV, HUB_API_DISABLE_API_TRUST_SYSPROP, "true"));
    }
    
    /**
     * Returns true if the integration with Microcks should be enabled in the UI.
     */
    public boolean isMicrocksEnabled() {
        return "true".equals(getConfigurationProperty(FEATURE_MICROCKS_ENV, FEATURE_MICROCKS_SYSPROP, "false"));
    }

    /**
     * Returns true if GraphQL support is enabled in the UI
     */
    public boolean isGraphQLEnabled() {
        return "true".equals(getConfigurationProperty(FEATURE_GRAPHQL_ENV, FEATURE_GRAPHQL_SYSPROP, "false"));
    }

    /**
     * Returns true if AsyncAPI support is enabled in the UI
     */
    public boolean isAsyncAPIEnabled() {
        return "true".equals(getConfigurationProperty(FEATURE_ASYNCAPI_ENV, FEATURE_ASYNCAPI_SYSPROP, "false"));
    }

    /**
     * Returns true if the "share with everyone" feature is enabled.
     */
    public boolean isShareWithEveryoneEnabled() {
        return "true".equals(getConfigurationProperty(FEATURE_SHARE_WITH_EVERYONE_ENV, FEATURE_SHARE_WITH_EVERYONE_SYSPROP, "false"));
    }

    /**
     * Returns the URL of the Apicurio UI.  This is typically blank, but in some strange cases it can 
     * be useful when creating certain links in the UI.
     */
    public String getUiUrl() {
        return getConfigurationProperty(HUB_UI_URL_ENV, HUB_UI_URL_SYSPROP, null);
    }

}
