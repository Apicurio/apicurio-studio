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
    private static ObjectMapper objectMapper = new ObjectMapper();

    static {
        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
    }

    public static <T> String toJson(T object) {
        try {
            return objectMapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    public static JsonNode toJsonTree(String json) {
        try {
            return objectMapper.readTree(json);
        } catch (IOException ioe) {
            System.err.println(json);
            throw new UncheckedIOException(ioe);
        }
    }

    public static <T> T fromJson(String json, Class<T> clazz) {
        try {
            return objectMapper.readValue(json, clazz);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        } catch (IOException ioe) {
            throw new UncheckedIOException(ioe);
        }
    }

    public static BaseOperation fromJson(JsonNode payload, Class<? extends BaseOperation> klazz) {
        try {
            return objectMapper.treeToValue(payload, klazz);
        } catch (JsonProcessingException e) {
            System.err.println(payload.toString());
            throw new RuntimeException(e);
        }
    }
}
