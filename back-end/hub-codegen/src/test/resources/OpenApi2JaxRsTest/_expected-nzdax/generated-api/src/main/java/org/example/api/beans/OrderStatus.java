
package org.example.api.beans;

import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum OrderStatus {

    open("open"),
    closed("closed"),
    canceled("canceled"),
    canceling("canceling");
    private final String value;
    private final static Map<String, OrderStatus> CONSTANTS = new HashMap<String, OrderStatus>();

    static {
        for (OrderStatus c: values()) {
            CONSTANTS.put(c.value, c);
        }
    }

    private OrderStatus(String value) {
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
    public static OrderStatus fromValue(String value) {
        OrderStatus constant = CONSTANTS.get(value);
        if (constant == null) {
            throw new IllegalArgumentException(value);
        } else {
            return constant;
        }
    }

}
