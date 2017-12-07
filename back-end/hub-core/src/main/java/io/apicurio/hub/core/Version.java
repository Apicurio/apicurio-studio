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

package io.apicurio.hub.core;

import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class Version {

    private static Logger logger = LoggerFactory.getLogger(Version.class);

    private Properties properties;
    
    @PostConstruct
    public void load() {
        this.properties = new Properties();
        try (InputStream input = Version.class.getResourceAsStream("version.properties")) {
            if (input == null) {
                this.properties.setProperty("version", "Unknown");
                this.properties.setProperty("date", new Date().toString());
            } else {
                this.properties.load(input);
            }
        } catch (IOException e) {
            logger.error("Error loading version information.", e);
        }
    }

    /**
     * @return the versionString
     */
    public String getVersionString() {
        return this.properties.getProperty("version", "Unknown");
    }

    /**
     * @return the versionDate
     */
    public Date getVersionDate() {
        String vds = this.properties.getProperty("date");
        try {
            if (vds == null) {
                return new Date();
            } else {
                return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(vds);
            }
        } catch (ParseException e) {
            return new Date();
        }
    }
    
    /**
     * @return the composite "full" version info
     */
    public String getVersionInfo() {
        return properties.getProperty("git.commit.id.describe", "<Non-Git Build>");
    }
    
    /**
     * Gets a version property value.
     * @param propertyName
     */
    public String getVersionProperty(String propertyName) {
        return this.properties.getProperty(propertyName);
    }

}
