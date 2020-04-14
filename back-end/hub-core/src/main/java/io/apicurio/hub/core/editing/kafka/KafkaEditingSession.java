/*
 * Copyright 2020 Red Hat
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

package io.apicurio.hub.core.editing.kafka;

import io.apicurio.hub.core.editing.IEditingSession;
import io.apicurio.hub.core.editing.ISessionContext;
import io.apicurio.hub.core.editing.ops.BaseOperation;
import io.apicurio.hub.core.editing.ops.JoinLeaveOperation;
import io.apicurio.hub.core.editing.ops.OperationFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.BiFunction;

/**
 * Kafka based editing session.
 *
 * @author Ales Justin
 */
public class KafkaEditingSession implements IEditingSession {
    private static final Logger logger = LoggerFactory.getLogger(KafkaEditingSession.class);

    private final String designId;
    private final KafkaHandler handler;

    private final Map<String, ISessionContext> contexts = new ConcurrentHashMap<>();
    private final Map<String, String> users = new ConcurrentHashMap<>();

    public KafkaEditingSession(String designId, KafkaHandler handler) {
        this.designId = designId;
        this.handler = handler;
        handler.addSession(this);
        this.handler.start();
    }

    @Override
    public void close() {
        handler.removeSession(this);
    }

    @Override
    public String getDesignId() {
        return designId;
    }

    @Override
    public String getUser(ISessionContext context) {
        // TODO -- can this context be remote ?!
        return users.get(context.getId());
    }

    @Override
    public Set<ISessionContext> getUserContexts() {
        throw new UnsupportedOperationException();
    }

    @Override
    public void join(ISessionContext context, String user) {
        contexts.put(context.getId(), context);
        users.put(context.getId(), user);
    }

    @Override
    public void leave(ISessionContext context) {
        contexts.remove(context.getId());
        users.remove(context.getId());
    }

    @Override
    public boolean isEmpty() {
        return contexts.isEmpty();
    }

    public void sendToOthers(BaseOperation operation, ISessionContext exclude) {
        handler.send(designId, KafkaAction.sendToOthers(operation, exclude.getId()));
    }

    void sendToOthers(BaseOperation operation, String excludedId) {
        for (ISessionContext context : contexts.values()) {
            if (context.getId().equals(excludedId) == false) {
                sendTo(operation, context);
            }
        }
    }

    @Override
    public void sendTo(BaseOperation operation, ISessionContext to) {
        try {
            to.sendAsText(operation);
        } catch (IOException e) {
            logger.error("Error sending ({}) operation/message to websocket with sessionId: {}", operation.getType(), to.getId(), e);
            // TODO what else can we do here??
        }
    }

    @Override
    public void sendTo(BiFunction<String, ISessionContext, BaseOperation> userSessionFn, ISessionContext to) {
        handler.send(designId, KafkaAction.sendToList(to.getId()));
    }

    void sendTo(String toId) {
        List<JoinLeaveOperation> ops = new ArrayList<>();
        contexts.values().forEach(otherContext -> {
            if (otherContext.getId().equals(toId) == false) {
                String otherUser = getUser(otherContext);
                JoinLeaveOperation op = OperationFactory.join(otherUser, otherContext);
                ops.add(op);
            }
        });
        if (ops.size() > 0) {
            handler.send(designId, KafkaAction.sendToExecute(ops, toId));
        }
    }

    void sendTo(List<? extends BaseOperation> ops, String toId) {
        ISessionContext context = contexts.get(toId);
        if (context != null) {
            ops.forEach(op -> sendTo(op, context));
        }
    }
}
