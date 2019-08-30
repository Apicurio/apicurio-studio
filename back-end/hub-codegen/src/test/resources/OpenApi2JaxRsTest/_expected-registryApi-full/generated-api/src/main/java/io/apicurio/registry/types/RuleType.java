
package io.apicurio.registry.types;

import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum RuleType {

    VALIDATION("VALIDATION"),
    COMPATIBILITY("COMPATIBILITY");
    private final String value;
    private final static Map<String, RuleType> CONSTANTS = new HashMap<String, RuleType>();

    static {
        for (RuleType c: values()) {
            CONSTANTS.put(c.value, c);
        }
    }

    private RuleType(String value) {
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
    public static RuleType fromValue(String value) {
        RuleType constant = CONSTANTS.get(value);
        if (constant == null) {
            throw new IllegalArgumentException(value);
        } else {
            return constant;
        }
    }

}
