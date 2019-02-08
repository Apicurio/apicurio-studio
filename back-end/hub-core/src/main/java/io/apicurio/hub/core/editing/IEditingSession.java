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
}
