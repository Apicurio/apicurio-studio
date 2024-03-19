package io.apicurio.studio.test.profile;

import io.apicurio.studio.test.resource.JWSMockResource;
import io.quarkus.test.junit.QuarkusTestProfile;

import java.util.List;
import java.util.Map;

/**
 * @author Carles Arnal
 */
public class AuthTestProfile implements QuarkusTestProfile {

    @Override
    public Map<String, String> getConfigOverrides() {
        return Map.of("smallrye.jwt.sign.key.location", "privateKey.jwk");
    }

    @Override
    public List<TestResourceEntry> testResources() {
        return List.of(
                new TestResourceEntry(JWSMockResource.class));
    }
}
