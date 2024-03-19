package io.apicurio.studio.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

/**
 * @author Jakub Senko jsenko@redhat.com
 */
public class SerDesObjectMapperHolder {

    private static final ObjectMapper JSON_MAPPER = new ObjectMapper();

    private static final YAMLMapper YAML_MAPPER = new YAMLMapper();

    static {
        JSON_MAPPER.registerModule(new JavaTimeModule());
        JSON_MAPPER.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        JSON_MAPPER.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        JSON_MAPPER.configure(DeserializationFeature.FAIL_ON_IGNORED_PROPERTIES, true);

        YAML_MAPPER.registerModule(new JavaTimeModule());
        YAML_MAPPER.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        YAML_MAPPER.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        YAML_MAPPER.configure(DeserializationFeature.FAIL_ON_IGNORED_PROPERTIES, true);
    }

    public static ObjectMapper getJSONMapper() {
        return JSON_MAPPER;
    }

    public static YAMLMapper getYAMLMapper() {
        return YAML_MAPPER;
    }

    private SerDesObjectMapperHolder() {
    }
}
