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

import io.apicurio.hub.core.config.HubConfiguration;
import io.apicurio.hub.core.editing.distributed.JMSEditingSession;
import io.apicurio.hub.core.editing.distributed.JMSSessionFactory;
import io.apicurio.hub.core.editing.events.EventsEditingSession;
import io.apicurio.hub.core.editing.events.EventsHandler;
import io.apicurio.hub.core.editing.ops.processors.OperationProcessorDispatcher;
import io.apicurio.hub.core.storage.IRollupExecutor;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

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
    private OperationProcessorDispatcher operationProcessor;
    @Inject
    private IRollupExecutor rollupExecutor;
    @Inject // EventsHandler should be lazy, so we're fine
    private EventsHandler handler;

    private Object jms;
    
    @PostConstruct
    public void setup() {
        // Only initialize JMS if we're going to use it!
        if ("jms".equals(config.getEditingSessionType())) {
            JMSSessionFactory jms = new JMSSessionFactory();
            jms.initialize(rollupExecutor);
            this.jms = jms;
        }
    }

    /**
     * Called to create an editing session.
     * @param designId
     */
    public IEditingSession createEditingSession(String designId) {
        String type = config.getEditingSessionType();
        if ("jms".equals(type)) {
            return new JMSEditingSession(designId, (JMSSessionFactory) jms, operationProcessor);
        } else if ("kafka".equals(type) || "infinispan".equals(type)) {
            return new EventsEditingSession(designId, handler);
        } else {
            return new EditingSession(designId, rollupExecutor);
        }
    }
    
}
