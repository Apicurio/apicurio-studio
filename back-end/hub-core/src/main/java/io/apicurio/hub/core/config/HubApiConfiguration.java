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
public class HubApiConfiguration extends Configuration {
    
    private static final String JDBC_TYPE_ENV = "APICURIO_HUB_STORAGE_JDBC_TYPE";
    private static final String JDBC_TYPE_SYSPROP = "apicurio.hub.storage.jdbc.type";

    private static final String JDBC_INIT_ENV = "APICURIO_HUB_STORAGE_JDBC_INIT";
    private static final String JDBC_INIT_SYSPROP = "apicurio.hub.storage.jdbc.init";

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

}
