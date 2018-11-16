package io.apicurio.hub.core.editing;

import io.apicurio.hub.core.editing.sessionbeans.BaseOperation;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public interface OperationHandler {
    void consumeOperation(BaseOperation operation);
}
