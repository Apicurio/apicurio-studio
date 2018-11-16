package io.apicurio.hub.core.editing;

import io.apicurio.hub.core.editing.sessionbeans.BaseOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public class ApicurioOperationHandler implements OperationHandler {
    private Map<String, OperationHandler> handlers = new HashMap<>();
    private static Logger logger = LoggerFactory.getLogger(ApicurioOperationHandler.class);

    @Override
    public void consumeOperation(BaseOperation operation) {
        String opType = operation.getType();

        if (handlers.containsKey(opType)) {
            handlers.get(opType).consumeOperation(operation);
        } else {
            logger.error("Received a operation of type {}, but no handler is registered. " +
                            "Operation *will be lost* (this is almost certainly an error).",
                    operation.getType());
        }
    }

    /**
     * Set listeners for operations by {@link BaseOperation} type (string).
     *
     * For example, "redo", "undo", "command", etc.
     *
     * Set as many listeners as needed by operation type.
     *
     * @param opType operation type
     * @param handler operation handler
     * @see BaseOperation#getType()
     */
    public ApicurioOperationHandler setOperationListener(String opType, OperationHandler handler) {
        handlers.put(opType, handler);
        logger.trace("Registered operation handler for {}", opType);
        return this;
    }

    /**
     * Set listeners for operations by {@link BaseOperation} type (string).
     *
     * For example, "redo", "undo", "command", etc.
     *
     * Set as many listeners as needed by operation type.
     *
     * @param opType operation type
     * @param handler operation handler
     * @see BaseOperation#getType()
     */
    public ApicurioOperationHandler setOperationListener(String[] opTypes,
                                                         OperationHandler handler) {
        for (String opType : opTypes) {
            handlers.put(opType, handler);
            logger.trace("Registered operation handler for {}", opType);
        }
        return this;
    }

    /**
     * Get all operation handlers
     * @return map of operation name to operation handler
     */
    public Map<String, OperationHandler> getHandlers() {
        return handlers;
    }
}
