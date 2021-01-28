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
import io.apicurio.datamodels.core.models.common.Components;
import io.apicurio.datamodels.core.models.common.IDefinition;
import io.apicurio.datamodels.core.visitors.TraverserDirection;
import io.apicurio.datamodels.openapi.v2.models.Oas20Definitions;
import io.apicurio.datamodels.openapi.v3.models.Oas30Components;

/**
 * @author eric.wittmann@gmail.com
 */
public class OpenApiInlinedSchemaRemover extends CombinedVisitorAdapter {

    /**
     * @see io.apicurio.datamodels.combined.visitors.CombinedVisitorAdapter#visitSchemaDefinition(io.apicurio.datamodels.core.models.common.IDefinition)
     */
    @Override
    public void visitSchemaDefinition(IDefinition def) {
        ExtensibleNode node = (ExtensibleNode) def;
        if (wasInlined(node)) {
            String definitionName = def.getName();
            Library.visitTree(node.ownerDocument(), new CombinedVisitorAdapter() {
                @Override
                public void visitComponents(Components node) {
                    Oas30Components components = (Oas30Components) node;
                    components.removeSchemaDefinition(definitionName);
                }
                @Override
                public void visitDefinitions(Oas20Definitions node) {
                    node.removeDefinition(definitionName);
                }
            }, TraverserDirection.down);
        }
    }

    private boolean wasInlined(ExtensibleNode node) {
        Extension inlinedExt = node.getExtension("x-codegen-inlined");
        if (inlinedExt == null) {
            return false;
        }
        return "true".equals(String.valueOf(inlinedExt.value));
    }
    
}
