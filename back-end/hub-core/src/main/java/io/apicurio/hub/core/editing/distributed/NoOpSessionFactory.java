package io.apicurio.hub.core.editing.distributed;

import io.apicurio.hub.core.editing.OperationHandler;
import io.apicurio.hub.core.editing.SharedApicurioSession;
import io.apicurio.hub.core.editing.sessionbeans.BaseOperation;

import javax.enterprise.context.ApplicationScoped;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
@ApplicationScoped
public class NoOpSessionFactory implements ApicurioDistributedSessionFactory {
    private static final SharedApicurioSession NOOP_SESSION = new NoOpSharedSession();

    @Override
    public SharedApicurioSession joinSession(String id, OperationHandler handler) {
        return NOOP_SESSION;
    }

    @Override
    public String getSessionType() {
        return "noop"; // Currently the default implementation
    }

    private static final class NoOpSharedSession implements SharedApicurioSession {

        @Override
        public void sendOperation(BaseOperation command) {
        }

        @Override
        public void setOperationHandler(OperationHandler commandHandler) {
        }

        @Override
        public void close() {
        }

        @Override
        public String getSessionId() {
            return "noop";
        }
    }
}
