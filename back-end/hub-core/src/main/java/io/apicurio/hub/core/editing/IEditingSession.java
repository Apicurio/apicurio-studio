/*
 * Copyright 2019 JBoss Inc
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

package io.apicurio.hub.core.editing;

import io.apicurio.hub.core.editing.ops.BaseOperation;

import java.util.Set;
import java.util.function.BiFunction;

/**
 * @author eric.wittmann@gmail.com
 */
public interface IEditingSession {
    
    /**
     * Called to close the editing session.
     * @see java.io.Closeable#close()
     */
    public void close();

    /**
     * Gets the design id associated with this editing session.
     * @return the designId
     */
    public String getDesignId();
    
    /**
     * Resolves the given session context to a user name.
     * @param context
     */
    public String getUser(ISessionContext context);
    
    /**
     * Returns the current set of user session contexts.
     */
    public Set<ISessionContext> getUserContexts();

    /**
     * Join the session context to this editing session.
     */
    public void join(ISessionContext context, String user);

    /**
     * Removes a session context from this editing session.
     * @param context
     */
    public void leave(ISessionContext context);

    /**
     * @return true if the editing session has no more users
     */
    public boolean isEmpty();
    
    /**
     * Sends an operation/message to all collaborators except the one represented by 'exclude'.
     * @param operation
     * @param exclude
     */
    public void sendToOthers(BaseOperation operation, ISessionContext exclude);

    /**
     * Sends an operation/message to just the given collaborator.
     * @param operation
     * @param to
     */
    public void sendTo(BaseOperation operation, ISessionContext to);

    /**
     * Sends an operation/message to just the given collaborator.
     * @param userSessionFn the function to obtain operation/message
     * @param to
     */
    public default void sendTo(BiFunction<String, ISessionContext, BaseOperation> userSessionFn, ISessionContext to) {
        for (ISessionContext otherContext : getUserContexts()) {
            String otherUser = getUser(otherContext);
            sendTo(userSessionFn.apply(otherUser, otherContext), to);
        }
    }
}
