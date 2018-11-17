package io.apicurio.hub.core.editing.operationprocessors;

import io.apicurio.hub.core.editing.ApiDesignEditingSession;
import io.apicurio.hub.core.editing.sessionbeans.BaseOperation;

import javax.websocket.Session;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public interface IOperationProcessor {
    void process(ApiDesignEditingSession editingSession, Session session, BaseOperation op);
    String getOperationName();
    Class<? extends BaseOperation> unmarshallKlazz();
}
