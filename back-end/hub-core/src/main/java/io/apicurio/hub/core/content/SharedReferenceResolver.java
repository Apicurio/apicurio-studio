/*
 * Copyright 2019 JBoss Inc
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

package io.apicurio.hub.core.content;

import io.apicurio.datamodels.core.models.Node;
import io.apicurio.hub.core.beans.ApiDesignContent;
import io.apicurio.hub.core.beans.SharingConfiguration;
import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.storage.IStorage;
import io.apicurio.hub.core.storage.StorageException;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.io.IOException;
import java.net.URI;

/**
 * Resolves an internal reference to a {@link Node} if the pointed resource is publicly shared.
 * 
 * @author c.desc2@gmail.com
 */
@ApplicationScoped
public class SharedReferenceResolver extends AbstractReferenceResolver {
    
    @Inject
    private IStorage storage;
    
    /**
     * Constructor.
     */
    public SharedReferenceResolver() {
    }
    
    /**
     * @see AbstractReferenceResolver#accepts(URI)
     */
    @Override
    protected boolean accepts(URI uri) {
        String scheme = uri.getScheme();
        return scheme != null && scheme.equalsIgnoreCase("apicurio");
    }
    
    /**
     * @see AbstractReferenceResolver#fetchUriContent(URI)
     */
    @Override
    protected String fetchUriContent(URI referenceUri) throws IOException {
        final String designId = referenceUri.getSchemeSpecificPart();
        try {
            final SharingConfiguration sharingConfig = storage.getSharingConfig(designId);
            if (sharingConfig != null) {
                final ApiDesignContent document = storage.getLatestContentDocumentForSharing(sharingConfig.getUuid());
                return document.getDocument();
            }
        } catch (StorageException | NotFoundException e) {
            return null;
        }
        return null;
    }

}
