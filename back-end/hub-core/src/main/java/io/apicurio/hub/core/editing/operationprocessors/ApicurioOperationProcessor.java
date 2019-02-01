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

import com.fasterxml.jackson.databind.JsonNode;
import io.apicurio.hub.core.editing.ApicurioSessionContext;
import io.apicurio.hub.core.editing.ApiDesignEditingSession;
import io.apicurio.hub.core.editing.sessionbeans.BaseOperation;
import io.apicurio.hub.core.util.JsonUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
@ApplicationScoped
public class ApicurioOperationProcessor {
    private static Logger logger = LoggerFactory.getLogger(ApicurioOperationProcessor.class);

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

    public void process(ApiDesignEditingSession editingSession, ApicurioSessionContext session, JsonNode payload) {
        String opType = payload.get("type").asText();
        IOperationProcessor processor = processorMap.get(opType);

        if (processor != null) {
            Class<? extends BaseOperation> klazz = processor.unmarshallKlazz();
            BaseOperation operation = JsonUtil.fromJsonToOperation(payload, klazz);
            processor.process(editingSession, session, operation);
        } else {
            logger.error("Unknown message type: {}. \nKnown types: {}", opType, processorMap);
            throw new IllegalArgumentException("Unknown message type " + opType);
            // TODO something went wrong if we got here - report an error of some kind
        }
    }
}
