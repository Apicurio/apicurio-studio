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

package io.apicurio.studio.shared.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author eric.wittmann@gmail.com
 */
public abstract class Configuration {

    private static Logger logger = LoggerFactory.getLogger(Configuration.class);

    private static final String KC_AUTH_URL_ENV = "APICURIO_KC_AUTH_URL";
    private static final String KC_AUTH_URL_SYSPROP = "apicurio.kc.auth.rootUrl";

    private static final String KC_AUTH_REALM_ENV = "APICURIO_KC_AUTH_REALM";
    private static final String KC_AUTH_REALM_SYSPROP = "apicurio.kc.auth.realm";

    /**
     * @return the configured Keycloak auth URL
     */
    public String getKeycloakAuthUrl() {
        return getConfigurationProperty(KC_AUTH_URL_ENV, KC_AUTH_URL_SYSPROP, "https://localhost:8443/auth");
    }

    /**
     * @return the configured Keycloak realm
     */
    public String getKeycloakRealm() {
        return getConfigurationProperty(KC_AUTH_REALM_ENV, KC_AUTH_REALM_SYSPROP, "apicurio");
    }

    /**
     * Looks for the given key in the following places (in order):
     * 
     * 1) Environment variables
     * 2) System Properties
     * 
     * @param envKey
     * @param sysPropKey
     * @param defaultValue
     */
    protected static String getConfigurationProperty(String envKey, String sysPropKey, String defaultValue) {
        String rval = System.getenv(envKey);
        if (rval == null || rval.trim().isEmpty()) {
            rval = System.getProperty(sysPropKey);
        }
        if (rval == null || rval.trim().isEmpty()) {
            rval = defaultValue;
        }
        logger.debug("Config Property: {}/{} = {}", envKey, sysPropKey, rval);

        return rval;
    }
}
