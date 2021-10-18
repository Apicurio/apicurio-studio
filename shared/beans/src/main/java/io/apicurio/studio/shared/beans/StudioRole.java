package io.apicurio.studio.shared.beans;

import java.util.Arrays;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public enum StudioRole {
    APICURIO_ADMIN("apicurio_admin");

    private static final Map<String, StudioRole> inverted;
    static {
        inverted = Arrays.stream(StudioRole.values())
                .collect(Collectors.toMap(StudioRole::getName, Function.identity()));
    }

    private final String name;

    StudioRole(String name) {
        this.name = name;
    }

    /**
     * @return the roleName
     */
    public String getName() {
        return name;
    }

    public static StudioRole forName(String name) {
        return inverted.get(name);
    }
}
