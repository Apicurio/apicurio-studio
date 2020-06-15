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

import io.apicurio.studio.shared.config.Configuration;

import java.util.Properties;
import java.util.UUID;
import javax.enterprise.context.ApplicationScoped;

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

    private static final String GITHUB_URL_ENV = "APICURIO_GITHUB_URL";
    private static final String GITHUB_URL_SYSPROP = "apicurio.hub.github.url";

    private static final String GITHUB_API_URL_ENV = "APICURIO_GITHUB_API_URL";
    private static final String GITHUB_API_URL_SYSPROP = "apicurio.hub.github.api";

    private static final String GITLAB_URL_ENV = "APICURIO_GITLAB_URL";
    private static final String GITLAB_URL_SYSPROP = "apicurio.hub.gitlab.url";

    private static final String GITLAB_API_URL_ENV = "APICURIO_GITLAB_API_URL";
    private static final String GITLAB_API_URL_SYSPROP = "apicurio.hub.gitlab.api";

    private static final String GITLAB_GROUP_ALL_AVAILABLE_ENV = "APICURIO_GITLAB_GROUP_ALL_AVAILABLE";
    private static final String GITLAB_GROUP_ALL_AVAILABLE_SYSPROP = "apicurio.hub.gitlab.group.all.available";

    private static final String GITLAB_GROUP_MIN_ACCESS_LEVEL_ENV = "APICURIO_GITLAB_GROUP_MIN_ACCESS_LEVEL";
    private static final String GITLAB_GROUP_MIN_ACCESS_LEVEL_SYSPROP = "apicurio.hub.gitlab.group.min.access.level";

    private static final String BITBUCKET_URL_ENV = "APICURIO_BITBUCKET_URL";
    private static final String BITBUCKET_URL_SYSPROP = "apicurio.hub.bitbucket.url";
    
    private static final String BITBUCKET_API_URL_ENV = "APICURIO_BITBUCKET_API_URL";
    private static final String BITBUCKET_API_URL_SYSPROP = "apicurio.hub.bitbucket.api";

    private static final String MICROCKS_API_URL_ENV = "APICURIO_MICROCKS_API_URL";
    private static final String MICROCKS_API_URL_SYSPROP = "apicurio.hub.microcks.api";

    private static final String MICROCKS_CLIENT_ID_ENV = "APICURIO_MICROCKS_CLIENT_ID";
    private static final String MICROCKS_CLIENT_ID_SYSPROP = "apicurio.hub.microcks.clientId";

    private static final String MICROCKS_CLIENT_SECRET_ENV = "APICURIO_MICROCKS_CLIENT_SECRET";
    private static final String MICROCKS_CLIENT_SECRET_SYSPROP = "apicurio.hub.microcks.clientSecret";

    private static final String EDITING_SESSION_TYPE_ENV = "APICURIO_HUB_EDITING_SESSION_TYPE";
    private static final String EDITING_SESSION_TYPE_SYSPROP = "apicurio.hub.editing.session.type";

    private static final String KAFKA_BOOTSTRAP_SERVERS_ENV = "KAFKA_BOOTSTRAP_SERVERS";
    private static final String KAFKA_BOOTSTRAP_SERVERS_SYSPROP = "boostrap.servers";

    private static final String KAFKA_GROUP_ID_ENV = "KAFKA_GROUP_ID";
    private static final String KAFKA_GROUP_ID_SYSPROP = "group.id";

    private static final String KAFKA_TOPIC_ENV = "APICURIO_HUB_EDITING_SESSION_KAFKA_TOPIC";
    private static final String KAFKA_TOPIC_SYSPROP = "apicurio.hub.editing.session.topic";

    private static final String KAFKA_CONSUMERS_ENV = "APICURIO_HUB_EDITING_SESSION_CONSUMERS";
    private static final String KAFKA_CONSUMERS_SYSPROP = "apicurio.hub.editing.session.consumers";

    private static final String KAFKA_THREADS_ENV = "APICURIO_HUB_EDITING_SESSION_THREADS";
    private static final String KAFKA_THREADS_SYSPROP = "apicurio.hub.editing.session.threads";

    private static final String KAFKA_TIMEOUT_ENV = "APICURIO_HUB_EDITING_SESSION_TIMEOUT";
    private static final String KAFKA_TIMEOUT_SYSPROP = "apicurio.hub.editing.session.timeout";

    private static final String INFINISPAN_CLUSTER_NAME_ENV = "APICURIO_HUB_EDITING_SESSION_CLUSTER_NAME";
    private static final String INFINISPAN_CLUSTER_NAME_SYSPROP = "apicurio.hub.editing.session.cluster.name";

    private static final String INFINISPAN_TRANSPORT_ENV = "APICURIO_HUB_EDITING_SESSION_TRANSPORT_";
    private static final String INFINISPAN_TRANSPORT_SYSPROP = "apicurio.hub.editing.session.transport.";

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
     * @return the configured GitHub URL
     */
    public String getGitHubUrl() {
        return getConfigurationProperty(GITHUB_URL_ENV, GITHUB_URL_SYSPROP, "https://github.com");
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
     * @return the configured GitLab URL
     */
    public String getGitLabUrl() {
        return getConfigurationProperty(GITLAB_URL_ENV, GITLAB_URL_SYSPROP, "https://gitlab.com");
    }

    /**
     * @return the configured GitLab API URL
     */
    public String getGitLabApiUrl() {
        return getConfigurationProperty(GITLAB_API_URL_ENV, GITLAB_API_URL_SYSPROP, "https://gitlab.com");
    }

    /**
     * @return the configured Bitbucket URL
     */
    public String getBitbucketUrl() {
        return getConfigurationProperty(BITBUCKET_URL_ENV, BITBUCKET_URL_SYSPROP, "https://bitbucket.org");
    }

    /**
     * @return the configured Bitbucket API URL
     */
    public String getBitbucketApiUrl() {
        return getConfigurationProperty(BITBUCKET_API_URL_ENV, BITBUCKET_API_URL_SYSPROP, "https://api.bitbucket.org/2.0");
    }

    /**
     * @return true if a microcks API has been configured (we assume that means microcks exists and we're integrated with it)
     */
    public boolean isMicrocksConfigured() {
        return getMicrocksApiUrl() != null;
    }

    /**
     * @return the configured Microcks API URL
     */
    public String getMicrocksApiUrl() {
        return getConfigurationProperty(MICROCKS_API_URL_ENV, MICROCKS_API_URL_SYSPROP, null);
    }

    /**
     * @return the configured Microcks ClientId
     */
    public String getMicrocksClientId() {
        return getConfigurationProperty(MICROCKS_CLIENT_ID_ENV, MICROCKS_CLIENT_ID_SYSPROP, null);
    }

    /**
     * @return the configured Microcks ClientSecret
     */
    public String getMicrocksClientSecret() {
        return getConfigurationProperty(MICROCKS_CLIENT_SECRET_ENV, MICROCKS_CLIENT_SECRET_SYSPROP, null);
    }

    /**
     * @return the configured distributed session type
     */
    public String getEditingSessionType() {
        return getConfigurationProperty(EDITING_SESSION_TYPE_ENV, EDITING_SESSION_TYPE_SYSPROP, null);
    }

    /**
     * @return Kafka bootstrap servers
     */
    public String getKafkaBootstrapServers() {
        return getConfigurationProperty(KAFKA_BOOTSTRAP_SERVERS_ENV, KAFKA_BOOTSTRAP_SERVERS_SYSPROP, "localhost:9092");
    }

    /**
     * @return Kafka group id
     */
    public String getKafkaGroupId() {
        return getConfigurationProperty(KAFKA_GROUP_ID_ENV, KAFKA_GROUP_ID_SYSPROP, UUID.randomUUID().toString());
    }

    /**
     * @return Kafka topic
     */
    public String getKafkaTopic() {
        return getConfigurationProperty(KAFKA_TOPIC_ENV, KAFKA_TOPIC_SYSPROP, "editing-session-topic");
    }

    /**
     * @return Kafka consumers
     */
    public int getKafkaConsumers() {
        String numberOfConsumers = getConfigurationProperty(KAFKA_CONSUMERS_ENV, KAFKA_CONSUMERS_SYSPROP, "1");
        return Integer.parseInt(numberOfConsumers);
    }

    /**
     * @return Kafka threads
     */
    public int getKafkaThreads() {
        String threads = getConfigurationProperty(KAFKA_THREADS_ENV, KAFKA_THREADS_SYSPROP, "3");
        return Integer.parseInt(threads);
    }

    /**
     * @return Kafka timeout
     */
    public int getKafkaTimeout() {
        String timeout = getConfigurationProperty(KAFKA_TIMEOUT_ENV, KAFKA_TIMEOUT_SYSPROP, "5");
        return Integer.parseInt(timeout);
    }

    /**
     * @return Infinispan cluster name
     */
    public String getInfinispanClusterName() {
        return getConfigurationProperty(INFINISPAN_CLUSTER_NAME_ENV, INFINISPAN_CLUSTER_NAME_SYSPROP, "apicurio-studio");
    }

    /**
     * @return Infinispan transport properties
     */
    public Properties getInfinispanTransportProperties() {
        return getConfigurationProperties(INFINISPAN_TRANSPORT_ENV, INFINISPAN_TRANSPORT_SYSPROP, false);
    }
}
