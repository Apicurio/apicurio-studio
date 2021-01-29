
package org.example.api.beans;

import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum IfExists {

    FAIL("FAIL"),
    UPDATE("UPDATE"),
    RETURN("RETURN"),
    RETURN_OR_UPDATE("RETURN_OR_UPDATE");
    private final String value;
    private final static Map<String, IfExists> CONSTANTS = new HashMap<String, IfExists>();

    static {
        for (IfExists c: values()) {
            CONSTANTS.put(c.value, c);
        }
    }

    private IfExists(String value) {
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
    public static IfExists fromValue(String value) {
        IfExists constant = CONSTANTS.get(value);
        if (constant == null) {
            throw new IllegalArgumentException(value);
        } else {
            return constant;
        }
    }

}
