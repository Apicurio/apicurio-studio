
package org.example.api.beans;

import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ArtifactType {

    AVRO("avro"),
    PROTOBUFF("protobuff"),
    JSON("json"),
    OPENAPI("openapi"),
    ASYNCAPI("asyncapi");
    private final String value;
    private final static Map<String, ArtifactType> CONSTANTS = new HashMap<String, ArtifactType>();

    static {
        for (ArtifactType c: values()) {
            CONSTANTS.put(c.value, c);
        }
    }

    private ArtifactType(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return this.value;
    }

    @JsonValue
    public String value() {
        return this.value;
    }

    @JsonCreator
    public static ArtifactType fromValue(String value) {
        ArtifactType constant = CONSTANTS.get(value);
        if (constant == null) {
            throw new IllegalArgumentException(value);
        } else {
            return constant;
        }
    }

}
