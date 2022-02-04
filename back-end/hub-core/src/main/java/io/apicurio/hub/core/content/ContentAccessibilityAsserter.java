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

import io.apicurio.datamodels.Library;
import io.apicurio.datamodels.core.models.Document;
import io.apicurio.datamodels.core.util.ReferenceResolverChain;
import io.apicurio.hub.core.beans.DereferenceControlResult;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

/**
 * Used to take a {@link Document} and check if it can be accessed from the hub-core package
 * @author c.desc2@gmail.com
 */
@ApplicationScoped
public class ContentAccessibilityAsserter {

    @Inject
    private AbsoluteReferenceResolver absoluteResolver;
    @Inject
    private SharedReferenceResolver sharedReferenceResolver;
    
    private final ReferenceResolverChain referenceResolverChain = new ReferenceResolverChain();

    @PostConstruct
    void init() {
        referenceResolverChain.addResolver(absoluteResolver);
        referenceResolverChain.addResolver(sharedReferenceResolver);
    }
    
    /**
     * Checks whether the minimal reference resolvers can handle a document.  Content must be in JSON format.
     * @param content
     * @return
     */
    public DereferenceControlResult isDereferenceable(String content) {
        final DereferenceControlResult res = new DereferenceControlResult();
        try {
            Document doc = Library.readDocumentFromJSONString(content);
            Library.dereferenceDocument(doc, referenceResolverChain, true);
            res.setSuccess(true);
        } catch (Exception e) {
            res.setError(e.getMessage());
            res.setSuccess(false);
        }
        return res;
    }

}
