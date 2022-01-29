
package io.apicurio.studio.rest.v1.beans;

import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

@io.quarkus.runtime.annotations.RegisterForReflection
public enum TeamSortBy {

    name("name"),
    createdOn("createdOn");
    private final String value;
    private final static Map<String, TeamSortBy> CONSTANTS = new HashMap<String, TeamSortBy>();

    static {
        for (TeamSortBy c: values()) {
            CONSTANTS.put(c.value, c);
        }
    }

    private TeamSortBy(String value) {
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
    public static TeamSortBy fromValue(String value) {
        TeamSortBy constant = CONSTANTS.get(value);
        if (constant == null) {
            throw new IllegalArgumentException(value);
        } else {
            return constant;
        }
    }

}
