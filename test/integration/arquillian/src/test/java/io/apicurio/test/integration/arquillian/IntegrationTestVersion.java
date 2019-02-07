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

package io.apicurio.test.integration.arquillian;

import java.util.Properties;

/**
 * @author eric.wittmann@gmail.com
 */
public class IntegrationTestVersion {
    
    private String version;

    /**
     * Constructor.
     */
    public IntegrationTestVersion() {
        loadProperties();
    }

    /**
     * Loads properties from "integration-test.version.properties" on the classpath.
     */
    private void loadProperties() {
        try {
            Properties props = new Properties();
            props.load(IntegrationTestVersion.class.getClassLoader().getResourceAsStream("integration-test.version.properties"));
            this.setVersion(props.getProperty("version"));
            System.out.println("Apicurio Integration Test Version: " + this.getVersion());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * @return the version
     */
    public String getVersion() {
        return version;
    }

    /**
     * @param version the version to set
     */
    public void setVersion(String version) {
        this.version = version;
    }
    
}
