
package io.apicurio.studio.rest.v1.beans;

import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

@io.quarkus.runtime.annotations.RegisterForReflection
public enum TeamMemberSortBy {

    name("name");
    private final String value;
    private final static Map<String, TeamMemberSortBy> CONSTANTS = new HashMap<String, TeamMemberSortBy>();

    static {
        for (TeamMemberSortBy c: values()) {
            CONSTANTS.put(c.value, c);
        }
    }

    private TeamMemberSortBy(String value) {
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
    public static TeamMemberSortBy fromValue(String value) {
        TeamMemberSortBy constant = CONSTANTS.get(value);
        if (constant == null) {
            throw new IllegalArgumentException(value);
        } else {
            return constant;
        }
    }

}
