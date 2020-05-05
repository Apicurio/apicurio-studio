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

import io.apicurio.hub.core.cmd.OaiCommandException;
import io.apicurio.hub.core.config.HubConfiguration;
import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.storage.IRollupExecutor;
import io.apicurio.hub.core.storage.StorageException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @author Ales Justin
 */
public abstract class AbstractEventsHandler implements EventsHandler {
    protected final Logger log = LoggerFactory.getLogger(getClass());

    protected final HubConfiguration configuration;
    private final IRollupExecutor rollupExecutor;

    protected Map<String, IEditingSessionExt> sessions = new ConcurrentHashMap<>();

    public AbstractEventsHandler(HubConfiguration configuration, IRollupExecutor rollupExecutor) {
        this.configuration = configuration;
        this.rollupExecutor = rollupExecutor;
    }

    @Override
    public void addSession(IEditingSessionExt session) {
        sessions.put(session.getDesignId(), session);
    }

    @Override
    public void removeSession(IEditingSessionExt session) {
        String designId = session.getDesignId();
        sessions.remove(designId);
    }

    protected void rollup(String designId) {
        try {
            this.rollupExecutor.rollupCommands(designId);
        } catch (NotFoundException | StorageException | OaiCommandException e) {
            log.error("Error detected closing an Editing Session.", e);
        }
    }
}
