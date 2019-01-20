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
package io.apicurio.hub.core.editing.distributed;

import io.apicurio.hub.core.editing.OperationHandler;
import io.apicurio.hub.core.editing.SharedApicurioSession;
import io.apicurio.hub.core.editing.sessionbeans.BaseOperation;
import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.js.OaiCommandException;
import io.apicurio.hub.core.storage.IRollupExecutor;
import io.apicurio.hub.core.storage.StorageException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
@ApplicationScoped
public class NoOpSessionFactory implements ApicurioDistributedSessionFactory {
    //private final SharedApicurioSession NOOP_SESSION = new NoOpSharedSession();

    @Inject
    private IRollupExecutor rollupExecutor;

    @Override
    public SharedApicurioSession joinSession(String id, OperationHandler handler) {
        return new NoOpSharedSession(id);
    }

    @Override
    public String getSessionType() {
        return "noop"; // Currently the default implementation
    }

    private final class NoOpSharedSession implements SharedApicurioSession {
        private final Logger logger = LoggerFactory.getLogger(NoOpSharedSession.class);
        private final String designId;

        public NoOpSharedSession(String designId) {
            this.designId = designId;
        }

        @Override
        public void sendOperation(BaseOperation command) {
        }

        @Override
        public void setOperationHandler(OperationHandler commandHandler) {
        }

        @Override
        public void close() {
            try {
                rollupExecutor.rollupCommands(designId);
            } catch (NotFoundException | StorageException | OaiCommandException e) {
                logger.error("Failed to rollup commands for API with id: " + designId, "Rollup error: ", e);
            }
        }

        @Override
        public String getSessionId() {
            return "noop";
        }
    }
}
