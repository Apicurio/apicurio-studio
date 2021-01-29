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
import io.apicurio.datamodels.core.models.common.IPropertySchema;
import io.apicurio.datamodels.core.models.common.Schema;
import io.apicurio.datamodels.core.util.LocalReferenceResolver;
import io.apicurio.datamodels.openapi.models.OasSchema;
import io.apicurio.datamodels.openapi.v3.models.Oas30Schema;
import io.apicurio.datamodels.openapi.v3.models.Oas30Schema.Oas30AnyOfSchema;
import io.apicurio.datamodels.openapi.v3.models.Oas30Schema.Oas30NotSchema;
import io.apicurio.datamodels.openapi.v3.models.Oas30Schema.Oas30OneOfSchema;

/**
 * @author eric.wittmann@gmail.com
 */
public class OpenApiTypeInliner extends CombinedVisitorAdapter {

    /**
     * @see io.apicurio.datamodels.core.visitors.VisitorAdapter#visitSchema(io.apicurio.datamodels.core.models.common.Schema)
     */
    @Override
    public void visitSchema(Schema node) {
        OasSchema schema = (OasSchema) node;

        LocalReferenceResolver resolver = new LocalReferenceResolver();
        if (node.$ref != null) {
            Node referencedSchemaDefNode = resolver.resolveRef(node.$ref, node);
            if (referencedSchemaDefNode != null) {
                OasSchema referencedSchema = (OasSchema) referencedSchemaDefNode;
                if (isSimpleType(referencedSchema)) {
                    inlineSchema((Oas30Schema) node, referencedSchema);
                    markForRemoval(referencedSchema);
                } else if (isInlineSchema((ExtensibleNode) referencedSchemaDefNode)) {
                    inlineSchema(schema, (OasSchema) referencedSchemaDefNode);
                    markForRemoval((ExtensibleNode) referencedSchemaDefNode);
                }
            }
        }
    }

    /**
     * @see io.apicurio.datamodels.openapi.visitors.OasVisitorAdapter#visitItemsSchema(io.apicurio.datamodels.openapi.models.OasSchema)
     */
    @Override
    public void visitItemsSchema(OasSchema node) {
        visitSchema(node);
    }
    
    /**
     * @see io.apicurio.datamodels.openapi.visitors.OasVisitorAdapter#visitPropertySchema(io.apicurio.datamodels.core.models.common.IPropertySchema)
     */
    @Override
    public void visitPropertySchema(IPropertySchema node) {
        visitSchema((Schema) node);
    }
    
    /**
     * @see io.apicurio.datamodels.combined.visitors.CombinedVisitorAdapter#visitSchemaDefinition(io.apicurio.datamodels.core.models.common.IDefinition)
     */
    @Override
    public void visitSchemaDefinition(IDefinition node) {
        visitSchema((Schema) node);
    }
    
    /**
     * @see io.apicurio.datamodels.combined.visitors.CombinedVisitorAdapter#visitAdditionalPropertiesSchema(io.apicurio.datamodels.openapi.models.OasSchema)
     */
    @Override
    public void visitAdditionalPropertiesSchema(OasSchema node) {
        visitSchema(node);
    }
    
    /**
     * @see io.apicurio.datamodels.combined.visitors.CombinedVisitorAdapter#visitOneOfSchema(io.apicurio.datamodels.openapi.v3.models.Oas30Schema.Oas30OneOfSchema)
     */
    @Override
    public void visitOneOfSchema(Oas30OneOfSchema node) {
        visitSchema(node);
    }
    
    /**
     * @see io.apicurio.datamodels.combined.visitors.CombinedVisitorAdapter#visitAllOfSchema(io.apicurio.datamodels.openapi.models.OasSchema)
     */
    @Override
    public void visitAllOfSchema(OasSchema node) {
        visitSchema(node);
    }

    /**
     * @see io.apicurio.datamodels.combined.visitors.CombinedVisitorAdapter#visitAnyOfSchema(io.apicurio.datamodels.openapi.v3.models.Oas30Schema.Oas30AnyOfSchema)
     */
    @Override
    public void visitAnyOfSchema(Oas30AnyOfSchema node) {
        visitSchema(node);
    }

    /**
     * @see io.apicurio.datamodels.combined.visitors.CombinedVisitorAdapter#visitNotSchema(io.apicurio.datamodels.openapi.v3.models.Oas30Schema.Oas30NotSchema)
     */
    @Override
    public void visitNotSchema(Oas30NotSchema node) {
        visitSchema(node);
    }

    /**
     * Returns true if the given schema is a simple type (e.g. string, integer, etc).
     * @param schemaDef
     */
    private boolean isSimpleType(OasSchema schemaDef) {
        if ("string".equals(schemaDef.type)) {
            return schemaDef.enum_ == null;
        } else {
            return "integer".equals(schemaDef.type) || "number".equals(schemaDef.type) ||
                    "boolean".equals(schemaDef.type);
        }
    }

    /**
     * Copies all properties from the schema definition into the node, removing the $ref.
     * @param schema
     * @param schemaDef
     */
    private void inlineSchema(OasSchema schema, OasSchema schemaDef) {
        schema.$ref = null;
        
        // Copy everything from schemaDef into schema by serializing the former into a JSON
        // object and then deserialing that into the latter.
        Object serializedSchemaDef = Library.writeNode(schemaDef);
        Library.readNode(serializedSchemaDef, schema);
    }

    /**
     * Returns true if the schema definition is annotated with "x-codegen-inline" : "true".
     * @param referencedSchemaDefNode
     */
    private boolean isInlineSchema(ExtensibleNode referencedSchemaDefNode) {
        Extension extension = referencedSchemaDefNode.getExtension("x-codegen-inline");
        if (extension == null) {
            return false;
        }
        return "true".equals(String.valueOf(extension.value));
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
