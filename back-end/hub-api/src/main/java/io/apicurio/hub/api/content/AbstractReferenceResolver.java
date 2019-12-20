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

package io.apicurio.hub.api.content;

import io.apicurio.datamodels.core.util.IReferenceResolver;

/**
 * A base class for all reference resolvers.  This class handles any common functionality
 * needed by all/many reference resolvers.  Specifically it handles navigating the 
 * JSON tree to find a specific node identified by the "path" portion of an external
 * reference.
 * @author eric.wittmann@gmail.com
 */
public abstract class AbstractReferenceResolver implements IReferenceResolver {

}
