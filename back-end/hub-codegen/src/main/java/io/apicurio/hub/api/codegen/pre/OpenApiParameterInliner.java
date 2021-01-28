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
import io.apicurio.datamodels.core.models.ExtensibleNode;
import io.apicurio.datamodels.core.models.Extension;
import io.apicurio.datamodels.core.models.Node;
import io.apicurio.datamodels.core.models.common.IDefinition;
import io.apicurio.datamodels.core.models.common.Parameter;
import io.apicurio.datamodels.core.util.LocalReferenceResolver;
import io.apicurio.datamodels.openapi.models.OasParameter;

/**
 * @author eric.wittmann@gmail.com
 */
public class OpenApiParameterInliner extends CombinedVisitorAdapter {

    /**
     * @see io.apicurio.datamodels.combined.visitors.CombinedVisitorAdapter#visitParameter(io.apicurio.datamodels.core.models.common.Parameter)
     */
    @Override
    public void visitParameter(Parameter node) {
        OasParameter param = (OasParameter) node;

        LocalReferenceResolver resolver = new LocalReferenceResolver();
        if (param.$ref != null) {
            Node referencedParameterDefNode = resolver.resolveRef(param.$ref, param);
            if (referencedParameterDefNode != null) {
                inlineParameter(param, referencedParameterDefNode);
                markForRemoval((ExtensibleNode) referencedParameterDefNode);
            }
        }
    }
    
    /**
     * @see io.apicurio.datamodels.combined.visitors.CombinedVisitorAdapter#visitParameterDefinition(io.apicurio.datamodels.core.models.common.IDefinition)
     */
    @Override
    public void visitParameterDefinition(IDefinition node) {
        visitParameter((Parameter) node);
    }

    /**
     * Copies all properties from the parameter definition into the node, removing the $ref.
     * @param param
     * @param paramDef
     */
    private void inlineParameter(OasParameter param, Node paramDef) {
        param.$ref = null;
        
        // Copy everything from schemaDef into schema by serializing the former into a JSON
        // object and then deserializing that into the latter.
        Object serializedParamDef = Library.writeNode(paramDef);
        Library.readNode(serializedParamDef, param);
    }

    /**
     * @param node
     */
    private void markForRemoval(ExtensibleNode node) {
        Extension extension = node.createExtension();
        extension.name = "x-codegen-inlined";
        extension.value = Boolean.TRUE;
        node.addExtension(extension.name, extension);
    }

}
