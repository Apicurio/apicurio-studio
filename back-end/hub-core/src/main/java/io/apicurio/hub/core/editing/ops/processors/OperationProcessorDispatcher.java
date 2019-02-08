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
package io.apicurio.hub.core.editing.ops.processors;

import java.util.LinkedHashMap;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.JsonNode;

import io.apicurio.hub.core.editing.IEditingSession;
import io.apicurio.hub.core.editing.ISessionContext;
import io.apicurio.hub.core.editing.ops.BaseOperation;
import io.apicurio.hub.core.util.JsonUtil;

/**
 * This class manages a set of {@link IOperationProcessor} instances.  Its role is to figure
 * out which processor to use for a given inbound message (a message sent to the server via
 * a websocket).  
 * 
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
@ApplicationScoped
public class OperationProcessorDispatcher {
    private static Logger logger = LoggerFactory.getLogger(OperationProcessorDispatcher.class);

    @Inject
    private Instance<IOperationProcessor> processorInstances;

    private Map<String, IOperationProcessor> processorMap = new LinkedHashMap<>();

    @PostConstruct
    private void postConstruct() {
        for (IOperationProcessor opProc : processorInstances) {
            logger.debug("Added operation processor: {} -> {}",
                    opProc.getOperationName(),
                    opProc.getClass().getCanonicalName());

            processorMap.put(opProc.getOperationName(), opProc);
        }
    }

    /**
     * Process a given JSON payload (obtained from the inbound websocket).  This is done by
     * figuring out the type of the payload and then unmarshalling it into a {@link BaseOperation}.
     * @param editingSession
     * @param context
     * @param message
     */
    public void process(IEditingSession editingSession, ISessionContext context, JsonNode message) {
        String opType = message.get("type").asText();
        IOperationProcessor processor = processorMap.get(opType);

        logger.debug("Received a \"{}\" message/operation from a client for API Design: {}", opType, editingSession.getDesignId());

        if (processor != null) {
            Class<? extends BaseOperation> unmarshallClass = processor.unmarshallClass();
            BaseOperation operation = JsonUtil.fromJsonToOperation(message, unmarshallClass);
            processor.process(editingSession, context, operation);
        } else {
            logger.error("Unknown message/operation type: {}. \nKnown types: {}", opType, processorMap);
            throw new IllegalArgumentException("Unknown message type " + opType);
            // TODO something went wrong if we got here - report an error of some kind
        }
    }
}
