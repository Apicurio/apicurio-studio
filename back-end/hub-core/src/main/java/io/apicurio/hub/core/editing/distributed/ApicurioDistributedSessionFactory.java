package io.apicurio.hub.core.editing.distributed;

import io.apicurio.hub.core.editing.OperationHandler;
import io.apicurio.hub.core.editing.SharedApicurioSession;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public interface ApicurioDistributedSessionFactory {
    // Suggest API ID
    SharedApicurioSession joinSession(String id, OperationHandler handler);

    // Session type string indentifier (e.g. JMS, NOOP, etc).
    String getSessionType();
}

