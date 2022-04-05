
package io.apicurio.registry.types;

import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

@io.quarkus.runtime.annotations.RegisterForReflection
public enum RoleType {

    READ_ONLY("READ_ONLY"),
    DEVELOPER("DEVELOPER"),
    ADMIN("ADMIN");
    private final String value;
    private final static Map<String, RoleType> CONSTANTS = new HashMap<String, RoleType>();

    static {
        for (RoleType c: values()) {
            CONSTANTS.put(c.value, c);
        }
    }

    private RoleType(String value) {
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
    public static RoleType fromValue(String value) {
        RoleType constant = CONSTANTS.get(value);
        if (constant == null) {
            throw new IllegalArgumentException(value);
        } else {
            return constant;
        }
    }

}
