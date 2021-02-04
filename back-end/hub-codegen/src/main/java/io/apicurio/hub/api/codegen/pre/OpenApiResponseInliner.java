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
import io.apicurio.datamodels.combined.visitors.CombinedVisitorAdapter;
import io.apicurio.datamodels.core.models.Node;
import io.apicurio.datamodels.core.models.common.IDefinition;
import io.apicurio.datamodels.core.util.LocalReferenceResolver;
import io.apicurio.datamodels.openapi.models.OasResponse;

/**
 * @author eric.wittmann@gmail.com
 */
public class OpenApiResponseInliner extends CombinedVisitorAdapter {

    /**
     * @see io.apicurio.datamodels.combined.visitors.CombinedVisitorAdapter#visitResponse(io.apicurio.datamodels.openapi.models.OasResponse)
     */
    @Override
    public void visitResponse(OasResponse node) {
        LocalReferenceResolver resolver = new LocalReferenceResolver();
        if (node.$ref != null) {
            Node referencedResponseDefNode = resolver.resolveRef(node.$ref, node);
            if (referencedResponseDefNode != null) {
                inlineResponse(node, referencedResponseDefNode);
            }
        }
    }
    
    /**
     * @see io.apicurio.datamodels.combined.visitors.CombinedVisitorAdapter#visitResponseDefinition(io.apicurio.datamodels.core.models.common.IDefinition)
     */
    @Override
    public void visitResponseDefinition(IDefinition node) {
        visitResponse((OasResponse) node);
    }

    /**
     * Copies all properties from the response definition into the node, removing the $ref.
     * @param response
     * @param responseDef
     */
    private void inlineResponse(OasResponse response, Node responseDef) {
        response.$ref = null;
        
        // Copy everything from schemaDef into schema by serializing the former into a JSON
        // object and then deserializing that into the latter.
        Object serializedParamDef = Library.writeNode(responseDef);
        Library.readNode(serializedParamDef, response);
    }

}
