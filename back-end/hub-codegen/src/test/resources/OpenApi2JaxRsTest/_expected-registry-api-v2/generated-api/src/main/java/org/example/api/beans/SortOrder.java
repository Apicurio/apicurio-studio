
package org.example.api.beans;

import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum SortOrder {

    asc("asc"),
    desc("desc");
    private final String value;
    private final static Map<String, SortOrder> CONSTANTS = new HashMap<String, SortOrder>();

    static {
        for (SortOrder c: values()) {
            CONSTANTS.put(c.value, c);
        }
    }

    private SortOrder(String value) {
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
    public static SortOrder fromValue(String value) {
        SortOrder constant = CONSTANTS.get(value);
        if (constant == null) {
            throw new IllegalArgumentException(value);
        } else {
            return constant;
        }
    }

}
