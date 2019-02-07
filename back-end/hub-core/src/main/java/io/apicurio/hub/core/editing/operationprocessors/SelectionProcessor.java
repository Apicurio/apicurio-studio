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

import io.apicurio.hub.core.editing.IEditingSession;
import io.apicurio.hub.core.editing.ISessionContext;
import io.apicurio.hub.core.editing.sessionbeans.BaseOperation;
import io.apicurio.hub.core.editing.sessionbeans.SelectionOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Singleton;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
@Singleton
public class SelectionProcessor implements IOperationProcessor {

    private static Logger logger = LoggerFactory.getLogger(SelectionProcessor.class);

    /**
     * @see io.apicurio.hub.core.editing.operationprocessors.IOperationProcessor#process(io.apicurio.hub.core.editing.IEditingSession, io.apicurio.hub.core.editing.ISessionContext, io.apicurio.hub.core.editing.sessionbeans.BaseOperation)
     */
    @Override
    public void process(IEditingSession editingSession, ISessionContext session, BaseOperation bo) {
        SelectionOperation selectionOp = (SelectionOperation) bo;

        if (bo.getSource() == BaseOperation.SourceEnum.LOCAL) {
            processLocal(editingSession, session, selectionOp);
        } else {
            processRemote(editingSession, session, selectionOp);
        }
    }

    private void processLocal(IEditingSession editingSession, ISessionContext session, SelectionOperation so) {
        String user = editingSession.getUser(session);
        String selection = so.getSelection();
        logger.debug("\tuser:" + user);
        logger.debug("\tselection:" + selection);
        editingSession.sendUserSelectionToOthers(session, user, selection);
        logger.debug("User selection propagated to 'other' clients.");
    }

    private void processRemote(IEditingSession editingSession, ISessionContext session, SelectionOperation so) {
        editingSession.sendToAllSessions(session, so);
        logger.debug("Remote selection sent to local clients.");
    }

    /**
     * @see io.apicurio.hub.core.editing.operationprocessors.IOperationProcessor#getOperationName()
     */
    @Override
    public String getOperationName() {
        return "selection";
    }

    /**
     * @see io.apicurio.hub.core.editing.operationprocessors.IOperationProcessor#unmarshallClass()
     */
    @Override
    public Class<? extends BaseOperation> unmarshallClass() {
        return SelectionOperation.class;
    }
}
