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

package io.apicurio.hub.api.codegen.jaxrs;

import io.apicurio.datamodels.combined.visitors.CombinedVisitorAdapter;
import io.apicurio.datamodels.openapi.models.OasPathItem;

/**
 * @author eric.wittmann@gmail.com
 */
public class PathItemDetectionVisitor extends CombinedVisitorAdapter {
    
    public boolean isPathItem = false;
    
    /**
     * @see io.apicurio.datamodels.combined.visitors.CombinedVisitorAdapter#visitPathItem(io.apicurio.datamodels.openapi.models.OasPathItem)
     */
    @Override
    public void visitPathItem(OasPathItem node) {
        this.isPathItem = true;
    }

}
