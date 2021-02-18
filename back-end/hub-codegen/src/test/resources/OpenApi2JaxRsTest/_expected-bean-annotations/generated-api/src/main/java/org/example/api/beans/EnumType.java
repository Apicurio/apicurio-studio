
package org.example.api.beans;

import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

@javax.enterprise.context.ApplicationScoped
public enum EnumType {

    OPTION1("OPTION1"),
    OPTION2("OPTION2"),
    OPTION3("OPTION3"),
    OPTION4("OPTION4");
    private final String value;
    private final static Map<String, EnumType> CONSTANTS = new HashMap<String, EnumType>();

    static {
        for (EnumType c: values()) {
            CONSTANTS.put(c.value, c);
        }
    }

    private EnumType(String value) {
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
    public static EnumType fromValue(String value) {
        EnumType constant = CONSTANTS.get(value);
        if (constant == null) {
            throw new IllegalArgumentException(value);
        } else {
            return constant;
        }
    }

}
