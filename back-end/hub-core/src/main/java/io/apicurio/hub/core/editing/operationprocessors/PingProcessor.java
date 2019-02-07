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
package io.apicurio.hub.core.editing.operationprocessors;

import io.apicurio.hub.core.editing.EditingSession;
import io.apicurio.hub.core.editing.ISessionContext;
import io.apicurio.hub.core.editing.sessionbeans.BaseOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Singleton;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
@Singleton
public class PingProcessor implements IOperationProcessor {

    private static Logger logger = LoggerFactory.getLogger(PingProcessor.class);

    @Override
    public void process(EditingSession editingSession, ISessionContext session, BaseOperation bo) {
        logger.debug("PING message received."); // TODO expand logging -- careful with session id
    }

    @Override
    public String getOperationName() {
        return "ping";
    }

    @Override
    public Class<? extends BaseOperation> unmarshallClass() {
        return BaseOperation.class;
    }
}
