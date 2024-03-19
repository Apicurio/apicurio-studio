package io.apicurio.studio.config;

import io.quarkus.runtime.configuration.ProfileManager;
import org.eclipse.microprofile.config.spi.ConfigSource;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class StudioConfigSource implements ConfigSource {
    private Map<String, String> properties;

    @Override
    public synchronized Map<String, String> getProperties() {
        if (properties == null) {
            properties = new HashMap<>();
            String prefix = System.getenv("APICURIO_PROPERTIES_PREFIX");
            if (prefix != null) {
                String profile = ProfileManager.getActiveProfile();
                String profilePrefix = "%" + profile + ".";
                Map<String, String> envMap = System.getenv();
                for (Map.Entry<String, String> entry : envMap.entrySet()) {
                    String key = entry.getKey();
                    if (key.startsWith(prefix)) {
                        String newKey = profilePrefix + key.replace("_", ".").toLowerCase();
                        properties.put(newKey, entry.getValue());
                    }
                }
            }
        }
        return properties;
    }

    @Override
    public Set<String> getPropertyNames() {
        return new HashSet<>(properties.values());
    }

    @Override
    public String getValue(String key) {
        return getProperties().get(key);
    }

    @Override
    public String getName() {
        return "Studio properties";
    }
}