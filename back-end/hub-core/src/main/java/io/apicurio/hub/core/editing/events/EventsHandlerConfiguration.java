/*
 * Copyright 2020 Red Hat
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

package io.apicurio.hub.core.editing.events;

import io.apicurio.hub.core.config.HubConfiguration;
import io.apicurio.hub.core.editing.infinispan.InfinispanEventsHandler;
import io.apicurio.hub.core.editing.kafka.KafkaEventsHandler;
import io.apicurio.hub.core.storage.IRollupExecutor;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Disposes;
import javax.enterprise.inject.Produces;
import javax.inject.Inject;

/**
 * @author Ales Justin
 */
@ApplicationScoped
public class EventsHandlerConfiguration {
    @Inject
    HubConfiguration configuration;

    @Inject
    IRollupExecutor rollupExecutor;

    @ApplicationScoped
    @Produces
    public EventsHandler getEventsHandler() {
        String type = configuration.getEditingSessionType();
        if ("kafka".equals(type)) {
            return new KafkaEventsHandler(configuration, rollupExecutor);
        } else if ("infinispan".equals(type)) {
            return new InfinispanEventsHandler(configuration, rollupExecutor);
        } else {
            throw new IllegalArgumentException("Unsupported type: " + type);
        }
    }

    public void closeEventsHandler(@Disposes EventsHandler handler) throws Exception {
        handler.close();
    }
}
