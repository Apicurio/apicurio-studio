
package org.example.api.beans;

import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ExchangeCapability {

    true("true"),
    false("false"),
    emulated("emulated");
    private final String value;
    private final static Map<String, ExchangeCapability> CONSTANTS = new HashMap<String, ExchangeCapability>();

    static {
        for (ExchangeCapability c: values()) {
            CONSTANTS.put(c.value, c);
        }
    }

    private ExchangeCapability(String value) {
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
    public static ExchangeCapability fromValue(String value) {
        ExchangeCapability constant = CONSTANTS.get(value);
        if (constant == null) {
            throw new IllegalArgumentException(value);
        } else {
            return constant;
        }
    }

}
