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

package io.apicurio.hub.api.util;

import java.io.IOException;
import java.util.Map;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * @author eric.wittmann@gmail.com
 */
public class OpenApiTools {
    
    private static final ObjectMapper mapper = new ObjectMapper();

    /**
     * Extracts and returns the name and description from the given OpenAPI spec.
     * @param content
     * @throws JsonProcessingException
     * @throws IOException
     */
    public static final NameAndDescription getNameAndDescriptionFromSpec(String content) throws JsonProcessingException, IOException {
        Map<String, Object> jsonContent = mapper.reader(Map.class).readValue(content);
        
        @SuppressWarnings("unchecked")
        Map<String, Object> infoContent = (Map<String, Object>) jsonContent.get("info");
        String name = (String) infoContent.get("title");
        String description = (String) infoContent.get("description");

        return new NameAndDescription(name, description);
    }
    
    public static class NameAndDescription {
        public final String name;
        public final String description;
        public NameAndDescription(String name, String description) {
            this.name = name;
            this.description = description;
        }
    }

}
