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

package io.apicurio.hub.api.rest.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.apicurio.datamodels.Library;
import io.apicurio.datamodels.core.models.Document;
import io.apicurio.datamodels.core.models.ValidationProblem;
import io.apicurio.datamodels.core.models.ValidationProblemSeverity;
import io.apicurio.datamodels.core.validation.IValidationSeverityRegistry;
import io.apicurio.datamodels.core.validation.ValidationRuleMetaData;
import io.apicurio.hub.api.beans.ValidationError;
import io.apicurio.hub.api.rest.IUtilsResource;
import io.apicurio.hub.core.util.FormatUtils;

/**
 * @author eric.wittmann@gmail.com
 */
public class UtilsResource implements IUtilsResource {

    private static Logger logger = LoggerFactory.getLogger(UtilsResource.class);

    /**
     * @see io.apicurio.hub.api.rest.IUtilsResource#validation(java.lang.String)
     */
    @Override
    public List<ValidationError> validation(String content) throws IOException {
        logger.info("Validating an API design.");
        String jsonContent = content;
        if (!content.trim().startsWith("{")) {
            jsonContent = FormatUtils.yamlToJson(jsonContent);
        }

        Document doc = Library.readDocumentFromJSONString(jsonContent);
        List<ValidationProblem> problems = Library.validate(doc, new IValidationSeverityRegistry() {
            @Override
            public ValidationProblemSeverity lookupSeverity(ValidationRuleMetaData rule) {
                return ValidationProblemSeverity.high;
            }
        });
        List<ValidationError> errors = new ArrayList<>();
        for (ValidationProblem problem : problems) {
            errors.add(new ValidationError(problem.errorCode, problem.nodePath.toString(), problem.property,
                    problem.message, problem.severity.name()));
        }
        return errors;
    }

}
