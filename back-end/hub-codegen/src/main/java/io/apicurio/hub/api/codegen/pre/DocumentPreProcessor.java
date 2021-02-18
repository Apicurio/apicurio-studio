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

package io.apicurio.hub.api.codegen.pre;

import io.apicurio.datamodels.Library;
import io.apicurio.datamodels.core.models.Document;
import io.apicurio.datamodels.core.visitors.IVisitor;
import io.apicurio.datamodels.core.visitors.TraverserDirection;

/**
 * Used to preprocess an OpenAPI document in a variety of ways with the intent of making the
 * result more conducive to generating the jax-rs and json schema code.
 * @author eric.wittmann@gmail.com
 */
public class DocumentPreProcessor {
    
    private static IVisitor [] processors = {
            new OpenApiLongSimpleTypeProcessor(),
            new OpenApiDateTimeSimpleTypeProcessor(),
            new OpenApiMapDataTypeProcessor(),
            new OpenApiTypeInliner(),
            new OpenApiInlinedSchemaRemover(),
            new OpenApiParameterInliner(),
            new OpenApiInlinedParameterRemover(),
            new OpenApiResponseInliner(),
            new OpenApiAllOfProcessor()
    };
    
    /**
     * Process the model.
     * @param document
     */
    public void process(Document document) {
        for (IVisitor proc : processors) {
            Library.visitTree(document, proc, TraverserDirection.down);
        }
    }

}
