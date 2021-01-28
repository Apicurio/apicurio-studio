
package org.example.api.beans;

import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum LogLevel {

    DEBUG("DEBUG"),
    TRACE("TRACE"),
    WARN("WARN"),
    ERROR("ERROR"),
    SEVERE("SEVERE"),
    WARNING("WARNING"),
    INFO("INFO"),
    CONFIG("CONFIG"),
    FINE("FINE"),
    FINER("FINER"),
    FINEST("FINEST");
    private final String value;
    private final static Map<String, LogLevel> CONSTANTS = new HashMap<String, LogLevel>();

    static {
        for (LogLevel c: values()) {
            CONSTANTS.put(c.value, c);
        }
    }

    private LogLevel(String value) {
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
    public static LogLevel fromValue(String value) {
        LogLevel constant = CONSTANTS.get(value);
        if (constant == null) {
            throw new IllegalArgumentException(value);
        } else {
            return constant;
        }
    }

}
