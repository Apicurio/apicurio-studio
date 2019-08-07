/*
 * Copyright 2019 Red Hat
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

package io.apicurio.hub.api.codegen.util;

import java.util.Arrays;

import org.apache.commons.codec.digest.DigestUtils;

import io.apicurio.datamodels.combined.visitors.CombinedAllNodeVisitor;
import io.apicurio.datamodels.core.models.common.IDefinition;
import io.apicurio.datamodels.core.models.common.Schema;
import io.apicurio.datamodels.openapi.models.OasSchema;
import io.apicurio.datamodels.openapi.v3.models.Oas30Schema.Oas30AnyOfSchema;
import io.apicurio.datamodels.openapi.v3.models.Oas30Schema.Oas30NotSchema;
import io.apicurio.datamodels.openapi.v3.models.Oas30Schema.Oas30OneOfSchema;

/**
 * @author eric.wittmann@gmail.com
 */
public class SchemaSigner extends CombinedAllNodeVisitor {
    
    private StringBuilder sigSource = new StringBuilder();

    /**
     * Constructor.
     */
    public SchemaSigner() {
    }
    
    public String getSignature() {
        if (this.sigSource.length() == 0) {
            return null;
        }
        return DigestUtils.sha256Hex(this.sigSource.toString());
    }
    
    /**
     * @see io.apicurio.datamodels.combined.visitors.CombinedAllNodeVisitor#visitSchema(io.apicurio.datamodels.core.models.common.Schema)
     */
    @Override
    public void visitSchema(Schema node) {
        OasSchema schema = (OasSchema) node;
        // Right now we only support simple types.
        if (schema.type != null && !schema.type.equals("object") && !schema.type.equals("array") && schema.$ref == null) {
            // Type
            this.sigSource.append("TYPE:");
            this.sigSource.append(schema.type);
            // Format
            if (schema.format != null) {
                this.sigSource.append("|FORMAT:");
                this.sigSource.append(schema.format);
            }
            // Enum
            if (schema.enum_ != null && schema.enum_.size() > 0) {
                this.sigSource.append("|ENUM:");
                String[] options = schema.enum_.toArray(new String[schema.enum_.size()]);
                Arrays.sort(options);
                for (String option : options) {
                    this.sigSource.append(option);
                    this.sigSource.append(",");
                }
            }
            

            // Max
            if (schema.maximum != null) {
                this.sigSource.append("|MAX:");
                this.sigSource.append(schema.maximum);
            }
            // Max Items
            if (schema.maxItems != null) {
                this.sigSource.append("|MAXITEMS:");
                this.sigSource.append(schema.maxItems);
            }
            // Max Length
            if (schema.maxLength != null) {
                this.sigSource.append("|MAXLENGTH:");
                this.sigSource.append(schema.maxLength);
            }
            // Min
            if (schema.minimum != null) {
                this.sigSource.append("|MIN:");
                this.sigSource.append(schema.minimum);
            }
            // Min Items
            if (schema.minItems != null) {
                this.sigSource.append("|MINITEMS:");
                this.sigSource.append(schema.minItems);
            }
            // Min Length
            if (schema.minLength != null) {
                this.sigSource.append("|MINLENGTH:");
                this.sigSource.append(schema.minLength);
            }
            // Min Properties
            if (schema.minProperties != null) {
                this.sigSource.append("|MINPROPS:");
                this.sigSource.append(schema.minProperties);
            }
            // Multiple Of
            if (schema.multipleOf != null) {
                this.sigSource.append("|MULTIPLEOF:");
                this.sigSource.append(schema.multipleOf);
            }
            // Pattern
            if (schema.pattern != null) {
                this.sigSource.append("|PATTERN:");
                this.sigSource.append(schema.pattern);
            }
        }
    }
    
    /**
     * @see io.apicurio.datamodels.combined.visitors.CombinedAllNodeVisitor#visitAdditionalPropertiesSchema(io.apicurio.datamodels.openapi.models.OasSchema)
     */
    @Override
    public void visitAdditionalPropertiesSchema(OasSchema node) {
        this.visitSchema(node);
    }
    /**
     * @see io.apicurio.datamodels.combined.visitors.CombinedAllNodeVisitor#visitAllOfSchema(io.apicurio.datamodels.openapi.models.OasSchema)
     */
    @Override
    public void visitAllOfSchema(OasSchema node) {
        this.visitSchema(node);
    }
    /**
     * @see io.apicurio.datamodels.combined.visitors.CombinedAllNodeVisitor#visitAnyOfSchema(io.apicurio.datamodels.openapi.v3.models.Oas30Schema.Oas30AnyOfSchema)
     */
    @Override
    public void visitAnyOfSchema(Oas30AnyOfSchema node) {
        this.visitSchema(node);
    }
    /**
     * @see io.apicurio.datamodels.combined.visitors.CombinedAllNodeVisitor#visitItemsSchema(io.apicurio.datamodels.openapi.models.OasSchema)
     */
    @Override
    public void visitItemsSchema(OasSchema node) {
        this.visitSchema(node);
    }
    /**
     * @see io.apicurio.datamodels.combined.visitors.CombinedAllNodeVisitor#visitSchemaDefinition(io.apicurio.datamodels.core.models.common.IDefinition)
     */
    @Override
    public void visitSchemaDefinition(IDefinition node) {
        this.visitSchema((OasSchema) node);
    }
    /**
     * @see io.apicurio.datamodels.combined.visitors.CombinedAllNodeVisitor#visitNotSchema(io.apicurio.datamodels.openapi.v3.models.Oas30Schema.Oas30NotSchema)
     */
    @Override
    public void visitNotSchema(Oas30NotSchema node) {
        this.visitSchema(node);
    }
    /**
     * @see io.apicurio.datamodels.combined.visitors.CombinedAllNodeVisitor#visitOneOfSchema(io.apicurio.datamodels.openapi.v3.models.Oas30Schema.Oas30OneOfSchema)
     */
    @Override
    public void visitOneOfSchema(Oas30OneOfSchema node) {
        this.visitSchema(node);
    }
    
}
