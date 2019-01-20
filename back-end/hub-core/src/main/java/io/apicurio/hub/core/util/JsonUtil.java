/*
 * Copyright 2018 JBoss Inc
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
package io.apicurio.hub.core.util;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.apicurio.hub.core.editing.sessionbeans.BaseOperation;

import java.io.IOException;
import java.io.UncheckedIOException;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public class JsonUtil {
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    static {
        OBJECT_MAPPER.setSerializationInclusion(JsonInclude.Include.NON_NULL);
    }

    /**
     * Convert object to JSON
     */
    public static <T> String toJson(T object) {
        try {
            return OBJECT_MAPPER.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Convert JSON content into a tree represented using {@link JsonNode} structure.
     *
     * @param json the json string
     * @return root json node
     */
    public static JsonNode toJsonTree(String json) {
        try {
            return OBJECT_MAPPER.readTree(json);
        } catch (IOException ioe) {
            System.err.println(json);
            throw new UncheckedIOException(ioe);
        }
    }

    /**
     * Unmarshall from JSON into a specific object tree, with clazz as the root.
     *
     * @param json the json string
     * @param clazz the root class to unmarshall json into
     * @param <T> the class type
     * @return instance of clazz
     */
    public static <T> T fromJson(String json, Class<T> clazz) {
        try {
            return OBJECT_MAPPER.readValue(json, clazz);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        } catch (IOException ioe) {
            throw new UncheckedIOException(ioe);
        }
    }

    /**
     * Unmarshall {@link JsonNode} structure into an operation
     *
     * @param payload the root node of the JSON structure
     * @param klazz the BaseOperation to unmarshall into
     * @return a new base operation consisting of data in payload
     */
    public static BaseOperation fromJsonToOperation(JsonNode payload, Class<? extends BaseOperation> klazz) {
        try {
            return OBJECT_MAPPER.treeToValue(payload, klazz);
        } catch (JsonProcessingException e) {
            System.err.println(payload.toString());
            throw new RuntimeException(e);
        }
    }
}
