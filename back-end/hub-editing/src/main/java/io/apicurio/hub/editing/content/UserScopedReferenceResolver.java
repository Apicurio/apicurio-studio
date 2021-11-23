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

package io.apicurio.hub.editing.content;

import io.apicurio.hub.core.beans.ApiDesignContent;
import io.apicurio.hub.core.content.AbstractReferenceResolver;
import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.storage.IStorage;
import io.apicurio.hub.core.storage.StorageException;

import java.io.IOException;
import java.net.URI;

/**
 * Resolves references that are local/internal to Apicurio using the permissions of a user.  These references will be of the following form:
 * 
 *   apicurio:API_ID#/path/to/Entity
 * 
 * An example of a valid local reference might be:
 * 
 *   apicurio:173827#/components/DataType
 * 
 * @author c.desc2@gmail.com
 */
public class UserScopedReferenceResolver extends AbstractReferenceResolver {
    
    private IStorage storage;
    
    private String userId;

    /**
     * Constructor.
     */
    public UserScopedReferenceResolver(final IStorage storage, final String userId) {
        this.storage = storage;
        this.userId = userId;
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
        try {
            String apiId = referenceUri.getSchemeSpecificPart();
            // TODO handle in-progress content?  this code will ignore any changes not yet rolled up via the rollup executor
            ApiDesignContent dc = storage.getLatestContentDocument(this.userId, apiId);
            if (dc != null) {
                return dc.getDocument();
            }
            return null;
        } catch (NotFoundException | StorageException e) {
            throw new IOException(e);
        }
    }

}
