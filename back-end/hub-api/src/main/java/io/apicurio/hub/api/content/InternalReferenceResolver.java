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

package io.apicurio.hub.api.content;

import java.io.IOException;
import java.net.URI;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import io.apicurio.hub.api.security.ISecurityContext;
import io.apicurio.hub.core.beans.ApiDesignContent;
import io.apicurio.hub.core.content.AbstractReferenceResolver;
import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.storage.IStorage;
import io.apicurio.hub.core.storage.StorageException;

/**
 * Resolves references that are local/internal to Apicurio.  These references will be of the following form:
 * 
 *   apicurio:API_ID#/path/to/Entity
 * 
 * An example of a valid local reference might be:
 * 
 *   apicurio:173827#/components/DataType
 * 
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class InternalReferenceResolver extends AbstractReferenceResolver {
    
    @Inject
    private IStorage storage;
    @Inject
    private ISecurityContext security;

    /**
     * Constructor.
     */
    public InternalReferenceResolver() {
    }
    
    /**
     * @see io.apicurio.hub.core.content.AbstractReferenceResolver#accepts(java.net.URI)
     */
    @Override
    protected boolean accepts(URI uri) {
        String scheme = uri.getScheme();
        return scheme != null && scheme.equalsIgnoreCase("apicurio");
    }
    
    /**
     * @see io.apicurio.hub.core.content.AbstractReferenceResolver#fetchUriContent(java.net.URI)
     */
    @Override
    protected String fetchUriContent(URI referenceUri) throws IOException {
        try {
            String apiId = referenceUri.getSchemeSpecificPart();
            // TODO handle in-progress content?  this code will ignore any changes not yet rolled up via the rollup executor
            ApiDesignContent dc = storage.getLatestContentDocument(security.getCurrentUser().getLogin(), apiId);
            if (dc != null) {
                return dc.getDocument();
            }
            return null;
        } catch (NotFoundException | StorageException e) {
            throw new IOException(e);
        }
    }

}
