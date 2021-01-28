
package org.example.api.beans;

import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Side {

    buy("buy"),
    sell("sell");
    private final String value;
    private final static Map<String, Side> CONSTANTS = new HashMap<String, Side>();

    static {
        for (Side c: values()) {
            CONSTANTS.put(c.value, c);
        }
    }

    private Side(String value) {
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
    public static Side fromValue(String value) {
        Side constant = CONSTANTS.get(value);
        if (constant == null) {
            throw new IllegalArgumentException(value);
        } else {
            return constant;
        }
    }

}
