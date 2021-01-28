
package io.apicurio.registry.types;

import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ArtifactState {

    ENABLED("ENABLED"),
    DISABLED("DISABLED"),
    DEPRECATED("DEPRECATED");
    private final String value;
    private final static Map<String, ArtifactState> CONSTANTS = new HashMap<String, ArtifactState>();

    static {
        for (ArtifactState c: values()) {
            CONSTANTS.put(c.value, c);
        }
    }

    private ArtifactState(String value) {
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
    public static ArtifactState fromValue(String value) {
        ArtifactState constant = CONSTANTS.get(value);
        if (constant == null) {
            throw new IllegalArgumentException(value);
        } else {
            return constant;
        }
    }

}
