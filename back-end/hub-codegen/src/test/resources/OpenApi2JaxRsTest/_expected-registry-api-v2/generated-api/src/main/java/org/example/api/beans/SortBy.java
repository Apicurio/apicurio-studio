
package org.example.api.beans;

import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum SortBy {

    name("name"),
    createdOn("createdOn");
    private final String value;
    private final static Map<String, SortBy> CONSTANTS = new HashMap<String, SortBy>();

    static {
        for (SortBy c: values()) {
            CONSTANTS.put(c.value, c);
        }
    }

    private SortBy(String value) {
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
    public static SortBy fromValue(String value) {
        SortBy constant = CONSTANTS.get(value);
        if (constant == null) {
            throw new IllegalArgumentException(value);
        } else {
            return constant;
        }
    }

}
