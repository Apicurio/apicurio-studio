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
import io.apicurio.hub.core.editing.sessionbeans.JoinLeaveOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Singleton;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
@Singleton
public class LeaveProcessor implements IOperationProcessor {

    private static Logger logger = LoggerFactory.getLogger(LeaveProcessor.class);

    public void process(ApiDesignEditingSession editingSession, ApicurioSessionContext session, BaseOperation bo) {
        JoinLeaveOperation lOp = (JoinLeaveOperation) bo;
        logger.debug("Received leave operation ", lOp);
        if (bo.getSource() == BaseOperation.SourceEnum.LOCAL) {
            throw new UnsupportedOperationException("Did not expect a local command: " + lOp);
        } else {
            processRemote(editingSession, session, lOp);
        }
    }

    private void processRemote(ApiDesignEditingSession editingSession, ApicurioSessionContext session, JoinLeaveOperation undo) {
        editingSession.sendToAllSessions(session, undo);
        logger.debug("Remote join sent to local clients.");
    }

    @Override
    public String getOperationName() {
        return "leave";
    }

    @Override
    public Class<? extends BaseOperation> unmarshallKlazz() {
        return JoinLeaveOperation.class;
    }
}
