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

package io.apicurio.hub.core.config;

import javax.enterprise.context.ApplicationScoped;

import io.apicurio.studio.shared.config.Configuration;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class HubConfiguration extends Configuration {
    
    private static final String JDBC_TYPE_ENV = "APICURIO_HUB_STORAGE_JDBC_TYPE";
    private static final String JDBC_TYPE_SYSPROP = "apicurio.hub.storage.jdbc.type";

    private static final String JDBC_INIT_ENV = "APICURIO_HUB_STORAGE_JDBC_INIT";
    private static final String JDBC_INIT_SYSPROP = "apicurio.hub.storage.jdbc.init";

    private static final String KEYCLOAK_DISABLE_TRUST_MANAGER_ENV = "APICURIO_KC_DISABLE_TRUST_MANAGER";
    private static final String KEYCLOAK_DISABLE_TRUST_MANAGER_SYSPROP = "apicurio.security.keycloak.disable-trust-manager";
    
    private static final String REPOSITORY_FILTER_ENV = "APICURIO_REPOSITORY_FILTER";
    private static final String REPOSITORY_FILTER_SYSPROP = "apicurio.repository.filter";
    
    private static final String SHARE_FOR_EVERYONE_ENV = "APICURIO_SHARE_FOR_EVERYONE";
    private static final String SHARE_FOR_EVERYONE_SYSPROP = "apicurio.share.for.everyone";

    private static final String GITHUB_API_URL_ENV = "APICURIO_GITHUB_API_URL";
    private static final String GITHUB_API_URL_SYSPROP = "apicurio.hub.github.api";

    private static final String GITLAB_API_URL_ENV = "APICURIO_GITLAB_API_URL";
    private static final String GITLAB_API_URL_SYSPROP = "apicurio.hub.gitlab.api";

    private static final String GITLAB_GROUP_ALL_AVAILABLE_ENV = "APICURIO_GITLAB_GROUP_ALL_AVAILABLE";
    private static final String GITLAB_GROUP_ALL_AVAILABLE_SYSPROP = "apicurio.hub.gitlab.group.all.available";

    private static final String GITLAB_GROUP_MIN_ACCESS_LEVEL_ENV = "APICURIO_GITLAB_GROUP_MIN_ACCESS_LEVEL";
    private static final String GITLAB_GROUP_MIN_ACCESS_LEVEL_SYSPROP = "apicurio.hub.gitlab.group.min.access.level";

    private static final String BITBUCKET_API_URL_ENV = "APICURIO_BITBUCKET_API_URL";
    private static final String BITBUCKET_API_URL_SYSPROP = "apicurio.hub.bitbucket.api";

    /**
     * @return the configured JDBC type (default: h2)
     */
    public String getJdbcType() {
        return getConfigurationProperty(JDBC_TYPE_ENV, JDBC_TYPE_SYSPROP, "h2");
    }

    /**
     * @return true if the database should be initialized programmatically (default: true)
     */
    public boolean isJdbcInit() {
        return "true".equals(getConfigurationProperty(JDBC_INIT_ENV, JDBC_INIT_SYSPROP, "true"));
    }

    /**
     * @return true if the trust manager should be disabled when communicating with Keycloak
     */
    public boolean isDisableKeycloakTrustManager() {
        return "true".equals(getConfigurationProperty(KEYCLOAK_DISABLE_TRUST_MANAGER_ENV, KEYCLOAK_DISABLE_TRUST_MANAGER_SYSPROP, "false"));
    }
    
    /**
     * @return the configured Bitbucket repository filter (if any)
     */
    public String getRepositoryFilter() {
        return getConfigurationProperty(REPOSITORY_FILTER_ENV, REPOSITORY_FILTER_SYSPROP, "");
    }
    
    /**
     * @return true if the "share APIs for everyone" global option is enabled
     */
    public boolean isShareForEveryone() {
        return "true".equals(getConfigurationProperty(SHARE_FOR_EVERYONE_ENV, SHARE_FOR_EVERYONE_SYSPROP, "false"));
    }

    /**
     * @return the configured GitHub API URL
     */
    public String getGitHubApiUrl() {
        return getConfigurationProperty(GITHUB_API_URL_ENV, GITHUB_API_URL_SYSPROP, "https://api.github.com");
    }

    /**
     * @return the configured GitLab Group access mode
     */
    public String getGitLabGroupAllAvailable() {
        return getConfigurationProperty(GITLAB_GROUP_ALL_AVAILABLE_ENV, GITLAB_GROUP_ALL_AVAILABLE_SYSPROP, "false");
    }

    /**
     * @return the configured GitLab Group min access level
     */
    public String getGitLabGroupMinAccessLevel() {
        return getConfigurationProperty(GITLAB_GROUP_MIN_ACCESS_LEVEL_ENV, GITLAB_GROUP_MIN_ACCESS_LEVEL_SYSPROP, null);
    }

    /**
     * @return the configured GitLab API URL
     */
    public String getGitLabApiUrl() {
        return getConfigurationProperty(GITLAB_API_URL_ENV, GITLAB_API_URL_SYSPROP, "https://gitlab.com");
    }

    /**
     * @return the configured Bitbucket API URL
     */
    public String getBitbucketApiUrl() {
        return getConfigurationProperty(BITBUCKET_API_URL_ENV, BITBUCKET_API_URL_SYSPROP, "https://api.bitbucket.org/2.0");
    }
    
}
