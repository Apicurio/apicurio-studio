/*
 * Copyright 2021 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.apicurio.hub.api.content;

import io.apicurio.hub.core.registry.IRegistry;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.io.IOException;
import java.net.URI;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Resolves references that are local/internal to Apicurio.  These references will be of the following form:
 *
 *   apicurio-registry:ARTIFACT_ID/VERSION#/path/to/Entity
 *
 * An example of a valid local reference might be:
 *
 *   apicurio-registry:MyRefClient/1#/components/schemas/FooType
 *
 * @author c.desc2@gmail.com
 */
@ApplicationScoped
public class RegistryReferenceResolver extends AbstractReferenceResolver {

    private static final Pattern REGISTRY_REFERENCE_PATTERN = Pattern.compile("^(?<artifactId>.+)/(?<artifactVersion>\\d+)$");

    @Inject
    private IRegistry registry;

    /**
     * Constructor.
     */
    public RegistryReferenceResolver() {
    }

    /**
     * @see AbstractReferenceResolver#accepts(URI)
     */
    @Override
    protected boolean accepts(URI uri) {
        String scheme = uri.getScheme();
        return scheme != null && scheme.equalsIgnoreCase("apicurio-registry");
    }

    /**
     * @see AbstractReferenceResolver#fetchUriContent(URI)
     */
    @Override
    protected String fetchUriContent(URI referenceUri) throws IOException {
        final String registryReference = referenceUri.getSchemeSpecificPart();
        final Matcher registryReferenceMatcher = REGISTRY_REFERENCE_PATTERN.matcher(registryReference);
        if (registryReferenceMatcher.matches()) {
            final String artifactId = registryReferenceMatcher.group("artifactId");
            final Integer artifactVersion = Integer.parseInt(registryReferenceMatcher.group("artifactVersion"));
            return registry.getArtifact(artifactId, artifactVersion);
        }
        return null;
    }

}
