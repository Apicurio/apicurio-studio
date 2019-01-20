/*
 * Copyright 2018 JBoss Inc
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
package io.apicurio.hub.core.editing.operationprocessors;

import io.apicurio.hub.core.editing.ApiDesignEditingSession;
import io.apicurio.hub.core.editing.ApicurioSessionContext;
import io.apicurio.hub.core.editing.sessionbeans.BaseOperation;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public interface IOperationProcessor {
    void process(ApiDesignEditingSession editingSession, ApicurioSessionContext session, BaseOperation op);
    String getOperationName();
    Class<? extends BaseOperation> unmarshallKlazz();
}
