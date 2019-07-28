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

package io.apicurio.hub.api.rest.impl;

import java.io.IOException;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.mashape.unirest.http.ObjectMapper;
import com.mashape.unirest.http.Unirest;

import io.apicurio.hub.core.Version;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationPath("/")
@ApplicationScoped
public class HubApplication extends Application {

    private static Logger logger = LoggerFactory.getLogger(HubApplication.class);
    private static com.fasterxml.jackson.databind.ObjectMapper jacksonObjectMapper = new com.fasterxml.jackson.databind.ObjectMapper();
    static {
        jacksonObjectMapper.setSerializationInclusion(Include.NON_NULL);
        Unirest.setObjectMapper(new ObjectMapper() {
            public <T> T readValue(String value, Class<T> valueType) {
                try {
                    return jacksonObjectMapper.readValue(value, valueType);
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }

            public String writeValue(Object value) {
                try {
                    return jacksonObjectMapper.writeValueAsString(value);
                } catch (JsonProcessingException e) {
                    throw new RuntimeException(e);
                }
            }
        });
    }
    
    @Inject
    private Version version;

    @PostConstruct
    public void postConstruct() {
        StringBuilder builder = new StringBuilder();
        builder.append("\n------------------------------------------------");
        builder.append("\nStarting up Apicurio Hub API");
        builder.append("\n\tVersion:  " + version.getVersionString());
        builder.append("\n\tBuilt On: " + version.getVersionDate().toString());
        builder.append("\n\tBuild:    " + version.getVersionInfo());
        builder.append("\n------------------------------------------------");
        logger.info(builder.toString());
    }

}
