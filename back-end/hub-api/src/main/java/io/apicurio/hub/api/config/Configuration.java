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

package io.apicurio.hub.api.config;

import javax.enterprise.context.ApplicationScoped;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class Configuration {

    /**
     * Looks for the given key in the following places (in order):
     * 
     * 1) Environment variables
     * 2) System Properties
     * 
     * @param key
     * @param defaultValue
     */
    private String getEnvVarOrSysProp(String key, String defaultValue) {
        String rval = System.getenv(key);
        if (rval == null) {
            rval = System.getProperty(key);
        }
        if (rval == null) {
            rval = defaultValue;
        }
        return rval;
    }

    /**
     * @return the configured JDBC type (default: h2)
     */
    public String getJdbcType() {
        return this.getEnvVarOrSysProp("apicurio.hub.storage.jdbc.type", "h2");
    }

    /**
     * @return true if the database should be initialized programmatically (default: true)
     */
    public boolean isJdbcInit() {
        return "true".equals(this.getEnvVarOrSysProp("apicurio.hub.storage.jdbc.init", "true"));
    }

}
