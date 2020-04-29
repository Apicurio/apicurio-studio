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

package io.apicurio.hub.core.editing.events;

import io.apicurio.hub.core.editing.AbstractEditingSession;
import io.apicurio.hub.core.editing.ISessionContext;
import io.apicurio.hub.core.editing.ops.BaseOperation;
import io.apicurio.hub.core.editing.ops.JoinLeaveOperation;
import io.apicurio.hub.core.editing.ops.OperationFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.function.BiFunction;

/**
 * Events based editing session.
 *
 * @author Ales Justin
 */
public class EventsEditingSession extends AbstractEditingSession implements IEditingSessionExt {

    private final EventsHandler handler;

    public EventsEditingSession(String designId, EventsHandler handler) {
        super(designId);
        this.handler = handler;
        handler.addSession(this);
        handler.start();
    }

    @Override
    public void join(ISessionContext context, String user) {
        super.join(context, user);
        handler.addSessionContext(getDesignId(), context);
    }

    @Override
    public void leave(ISessionContext context) {
        handler.removeSessionContext(getDesignId(), context);
        super.leave(context);
    }

    @Override
    public void close() {
        handler.removeSession(this);
    }

    public void sendToOthers(BaseOperation operation, ISessionContext exclude) {
        handler.send(getDesignId(), EventAction.sendToOthers(operation, exclude.getId()));
    }

    public void sendToOthers(BaseOperation operation, String excludedId) {
        for (ISessionContext context : getSessions().values()) {
            if (context.getId().equals(excludedId) == false) {
                sendTo(operation, context);
            }
        }
    }

    @Override
    public void sendTo(BiFunction<String, ISessionContext, BaseOperation> userSessionFn, ISessionContext to) {
        handler.send(getDesignId(), EventAction.sendToList(to.getId()));
    }

    public void sendTo(String toId) {
        List<JoinLeaveOperation> ops = new ArrayList<>();
        getSessions().values().forEach(otherContext -> {
            if (otherContext.getId().equals(toId) == false) {
                String otherUser = getUser(otherContext);
                JoinLeaveOperation op = OperationFactory.join(otherUser, otherContext);
                ops.add(op);
            }
        });
        if (ops.size() > 0) {
            handler.send(getDesignId(), EventAction.sendToExecute(ops, toId));
        }
    }

    public void sendTo(List<? extends BaseOperation> ops, String toId) {
        ISessionContext context = getSessions().get(toId);
        if (context != null) {
            ops.forEach(op -> sendTo(op, context));
        }
    }
}
