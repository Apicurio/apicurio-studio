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
