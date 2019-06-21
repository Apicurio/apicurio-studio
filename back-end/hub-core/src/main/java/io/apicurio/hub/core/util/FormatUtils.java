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

package io.apicurio.hub.core.util;

import java.io.IOException;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.fasterxml.jackson.dataformat.yaml.YAMLGenerator;

/**
 * @author eric.wittmann@gmail.com
 */
public class FormatUtils {
    
    private static ObjectMapper jsonMapper = new ObjectMapper();
    private static ObjectMapper yamlMapper;
    static {
        YAMLFactory factory = new YAMLFactory();
        factory.enable(YAMLGenerator.Feature.MINIMIZE_QUOTES);
        factory.enable(YAMLGenerator.Feature.ALWAYS_QUOTE_NUMBERS_AS_STRINGS);
        yamlMapper = new ObjectMapper(factory);
        
        jsonMapper.enable(SerializationFeature.INDENT_OUTPUT);
    }

    /**
     * Converts the content from JSON to YAML format.
     * @param content
     * @throws IOException 
     */
    public static String jsonToYaml(String content) throws IOException {
        JsonNode tree = jsonMapper.reader().readTree(content);
        return yamlMapper.writeValueAsString(tree);
    }

    /**
     * Converts the content from YAML to JSON format.
     * @param content
     * @throws IOException 
     */
    public static String yamlToJson(String content) throws IOException {
        JsonNode tree = yamlMapper.reader().readTree(content);
        return jsonMapper.writeValueAsString(tree);
    }

    /**
     * Takes JSON content and formats with a standard 2 spaces per indent.  This
     * is used to take (potentially) unformatted JSON and convert it to formatted JSON.
     * @param content
     * @throws IOException
     */
    public static String formatJson(String content) throws IOException {
        // If it's already formatted, do nothing.
        if (content.contains("\n")) {
            return content;
        }
        JsonNode tree = jsonMapper.reader().readTree(content);
        return jsonMapper.writeValueAsString(tree);
    }

}
