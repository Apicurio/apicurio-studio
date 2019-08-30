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

package io.apicurio.hub.api.codegen.util;

import org.apache.commons.lang.StringUtils;

import io.apicurio.datamodels.core.models.Document;
import io.apicurio.datamodels.core.models.Extension;
import io.apicurio.datamodels.openapi.models.OasSchema;
import io.apicurio.datamodels.openapi.v2.models.Oas20Document;
import io.apicurio.datamodels.openapi.v2.models.Oas20SchemaDefinition;
import io.apicurio.datamodels.openapi.v3.models.Oas30Document;
import io.apicurio.datamodels.openapi.v3.models.Oas30SchemaDefinition;

public final class CodegenUtil {
    
    public static final String schemaToPackageName(OasSchema schema, String defaultPackage) {
        String pname = defaultPackage;
        
        if (schema != null) {
            // Handle x-codegen-package (custom package name for a generated bean)
            Extension extension = schema.getExtension("x-codegen-package");
            if (extension != null && extension.value != null) {
                String packageName = String.valueOf(extension.value);
                if (!packageName.trim().isEmpty()) {
                    pname = packageName;
                }
            }
        }

        return pname;
    }

    public static final String schemaRefToFQCN(Document document, String schemaRef, String defaultPackage) {
        String cname = "GeneratedClass_" + System.currentTimeMillis();
        String pname = defaultPackage;
        if (schemaRef.startsWith("#/definitions/")) {
            cname = schemaRef.substring(14);
            Oas20Document doc20 = (Oas20Document) document;
            if (doc20.definitions != null) {
                Oas20SchemaDefinition definition = doc20.definitions.getDefinition(cname);
                pname = CodegenUtil.schemaToPackageName(definition, pname);
            }
        }
        if (schemaRef.startsWith("#/components/schemas/")) {
            cname = schemaRef.substring(21);
            Oas30Document doc30 = (Oas30Document) document;
            if (doc30.components != null) {
                Oas30SchemaDefinition definition = doc30.components.getSchemaDefinition(cname);
                pname = CodegenUtil.schemaToPackageName(definition, pname);
            }
        }
        return pname + "." + StringUtils.capitalize(cname);
    }
    
}
