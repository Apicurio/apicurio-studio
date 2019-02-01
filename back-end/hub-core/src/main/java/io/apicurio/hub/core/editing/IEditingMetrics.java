/*
 * Copyright 2017 JBoss Inc
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

import java.io.IOException;

/**
 * Interface used to report metrics information for the WebSocket based editing component.
 * @author eric.wittmann@gmail.com
 */
public interface IEditingMetrics {

    /**
     * Returns the current state of the metrics.  This information is typically presented
     * via a REST API or servlet.
     * @return metrics information
     */
    public String getCurrentMetricsInfo() throws IOException;

    /**
     * Indicates that a web socket was connected.
     * @param designId
     * @param user
     */
    public void socketConnected(String designId, String user);

    /**
     * Indicates that an editing session was created.
     * @param designId
     */
    public void editingSessionCreated(String designId);

    /**
     * Indicates that a content command was received.
     * @param designId
     */
    public void contentCommand(String designId);

    /**
     * Indicates that a user wants to "undo" a command/content version.
     * @param designId
     * @param contentVersion
     */
    public void undoCommand(String designId, long contentVersion);

    /**
     * Indicates that a user wants to "redo" a command/content version.
     * @param designId
     * @param contentVersion
     */
    public void redoCommand(String designId, long contentVersion);

}
