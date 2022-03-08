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

import io.apicurio.datamodels.Library;
import io.apicurio.datamodels.core.models.Document;
import io.apicurio.hub.core.content.AbsoluteReferenceResolver;
import io.apicurio.hub.core.content.SharedReferenceResolver;
import io.apicurio.hub.core.exceptions.UnresolvableReferenceException;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.io.IOException;

/**
 * Used to take a {@link Document} and convert it to its dereferenced
 * form.  This means inlining all external references ($ref) so that
 * the external content is pulled into the document, and then the 
 * reference is made internal.  This always results in a document that
 * has no external references.
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class ContentDereferencer {

    @Inject
    private AbsoluteReferenceResolver absoluteResolver;
    @Inject
    private SharedReferenceResolver sharedReferenceResolver;

    @PostConstruct
    void init() {
        Library.addReferenceResolver(absoluteResolver);
        Library.addReferenceResolver(sharedReferenceResolver);
    }
    
    /**
     * Called to dereference the given content.  Content must be in JSON format.
     * @param content
     * @throws IOException
     */
    public String dereference(String content) throws UnresolvableReferenceException {
        Document doc = Library.readDocumentFromJSONString(content);
        try {
            doc = Library.dereferenceDocument(doc, true);
        } catch (Exception e) {
            throw new UnresolvableReferenceException(e);
        }
        return Library.writeDocumentToJSONString(doc);
    }

}
