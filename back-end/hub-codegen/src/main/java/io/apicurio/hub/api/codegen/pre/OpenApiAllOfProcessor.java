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

import java.util.ArrayList;
import java.util.List;

import io.apicurio.datamodels.Library;
import io.apicurio.datamodels.combined.visitors.CombinedVisitorAdapter;
import io.apicurio.datamodels.core.models.common.IDefinition;
import io.apicurio.datamodels.core.models.common.IPropertySchema;
import io.apicurio.datamodels.core.models.common.Schema;
import io.apicurio.datamodels.core.util.LocalReferenceResolver;
import io.apicurio.datamodels.openapi.models.OasSchema;
import io.apicurio.datamodels.openapi.v3.models.Oas30Schema.Oas30AnyOfSchema;
import io.apicurio.datamodels.openapi.v3.models.Oas30Schema.Oas30NotSchema;
import io.apicurio.datamodels.openapi.v3.models.Oas30Schema.Oas30OneOfSchema;

/**
 * @author eric.wittmann@gmail.com
 */
public class OpenApiAllOfProcessor extends CombinedVisitorAdapter {
    
    /**
     * @see io.apicurio.datamodels.combined.visitors.CombinedVisitorAdapter#visitSchema(io.apicurio.datamodels.core.models.common.Schema)
     */
    @Override
    public void visitSchema(Schema node) {
        OasSchema schema = (OasSchema) node;
        if (schema.allOf != null) {
            List<String> required = new ArrayList<>();
            schema.allOf.forEach(allOfSchema -> {
                OasSchema allOf = (OasSchema) allOfSchema;
                if (allOf.$ref != null) {
                    LocalReferenceResolver resolver = new LocalReferenceResolver();
                    allOf = (OasSchema) resolver.resolveRef(allOf.$ref, allOf);
                }
                if (allOf != null) {
                    if (allOf.required != null) {
                        required.addAll(allOf.required);
                    }
                    Object serializedAllOf = Library.writeNode(allOf);
                    Library.readNode(serializedAllOf, schema);
                }
            });
            schema.allOf = null;
            schema.$ref = null;
            schema.required = required;
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

}
