/*
 * Copyright 2019 JBoss Inc
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

package io.apicurio.test.integration.common;

import java.util.Properties;

/**
 * @author eric.wittmann@gmail.com
 */
public class IntegrationTestProperties {
    
    private static Properties properties = new Properties();
    static {
        loadProperties();
    }

    /**
     * Constructor.
     */
    public IntegrationTestProperties() {
    }

    /**
     * Loads properties from "integration-test.version.properties" on the classpath.
     */
    private static void loadProperties() {
        try {
            properties.load(IntegrationTestProperties.class.getClassLoader().getResourceAsStream("integration-test.version.properties"));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    
    /**
     * Gets a named property.
     * @param key
     */
    public String get(String key) {
        return properties.getProperty(key);
    }

    /**
     * @return the version
     */
    public String getVersion() {
        return properties.getProperty("version");
    }
    
}
