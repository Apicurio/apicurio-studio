
package io.apicurio.studio.types;

import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

@io.quarkus.runtime.annotations.RegisterForReflection
public enum ArtifactType {

    JSON_SCHEMA("JSON_SCHEMA"),
    OPENAPI("OPENAPI"),
    ASYNCAPI("ASYNCAPI");
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
