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

package io.apicurio.hub.core.editing;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import io.apicurio.hub.core.config.HubConfiguration;
import io.apicurio.hub.core.editing.distributed.IDistributedSessionFactory;
import io.apicurio.hub.core.editing.distributed.JMSEditingSession;
import io.apicurio.hub.core.editing.ops.processors.OperationProcessorDispatcher;
import io.apicurio.hub.core.storage.IRollupExecutor;

/**
 * Factory used to create an appropriate editing session based on how the Apicurio application
 * is configured and deployed.
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class EditingSessionFactory {

    @Inject
    private HubConfiguration config;
    @Inject
    private IDistributedSessionFactory distSessionFactory;
    @Inject
    private OperationProcessorDispatcher operationProcessor;
    @Inject
    private IRollupExecutor rollupExecutor;

    /**
     * Called to create an editing session.
     * @param designId
     */
    public IEditingSession createEditingSession(String designId) {
        String type = config.getEditingSessionType();
        if ("jms".equals(type)) {
            return new JMSEditingSession(designId, distSessionFactory, operationProcessor);
        } else {
            return new EditingSession(designId, rollupExecutor);
        }
    }
    
}
