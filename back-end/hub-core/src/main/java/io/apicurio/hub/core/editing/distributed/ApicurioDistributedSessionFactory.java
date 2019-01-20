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
package io.apicurio.hub.core.editing.distributed;

import io.apicurio.hub.core.editing.OperationHandler;
import io.apicurio.hub.core.editing.SharedApicurioSession;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public interface ApicurioDistributedSessionFactory {
    // Suggest API ID
    SharedApicurioSession joinSession(String id, OperationHandler handler);

    /**
     * Factory/session type(e.g. JMS, NOOP, etc).
     *
     * @see DistributedImplementationFactory
     */
    String getSessionType();
}

