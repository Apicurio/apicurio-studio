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

import io.apicurio.hub.core.editing.ApiDesignEditingSession;
import io.apicurio.hub.core.editing.ApicurioSessionContext;
import io.apicurio.hub.core.editing.sessionbeans.BaseOperation;
import io.apicurio.hub.core.editing.sessionbeans.ListClientsOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Singleton;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
@Singleton
public class ListClientsProcessor implements IOperationProcessor {

    private static Logger logger = LoggerFactory.getLogger(ListClientsProcessor.class);

    public void process(ApiDesignEditingSession editingSession, ApicurioSessionContext session, BaseOperation bo) {
        ListClientsOperation lOp = (ListClientsOperation) bo;
        logger.debug("Received 'list clients' operation ", lOp);
        if (bo.getSource() == BaseOperation.SourceEnum.LOCAL) {
            throw new UnsupportedOperationException("Did not expect a local command: " + lOp);
        } else {
            processRemote(editingSession);
        }
    }

    private void processRemote(ApiDesignEditingSession editingSession) {
        logger.debug("Listing all local clients (over remote session only).");
        editingSession.sendJoinToRemote();
    }

    @Override
    public String getOperationName() {
        return "list-clients";
    }

    @Override
    public Class<? extends BaseOperation> unmarshallKlazz() {
        return ListClientsOperation.class;
    }
}
