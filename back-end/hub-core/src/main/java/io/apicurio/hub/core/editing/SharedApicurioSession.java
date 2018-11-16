package io.apicurio.hub.core.editing;

import io.apicurio.hub.core.editing.sessionbeans.BaseOperation;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public interface SharedApicurioSession {

    void sendOperation(BaseOperation command);

    void setOperationHandler(OperationHandler commandHandler);

    void close();

    String getSessionId(); // not sure we need this one in the interface
}
