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
            BaseOperation operation = JsonUtil.fromJson(payload, klazz);
            processor.process(editingSession, session, operation);
        } else {
            logger.error("Unknown message type: {}", opType);
            // TODO something went wrong if we got here - report an error of some kind
        }
    }
}
