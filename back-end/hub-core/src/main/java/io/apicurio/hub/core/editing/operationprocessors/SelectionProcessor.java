package io.apicurio.hub.core.editing.operationprocessors;

import io.apicurio.hub.core.editing.ApiDesignEditingSession;
import io.apicurio.hub.core.editing.ApicurioSessionContext;
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


    public void process(ApiDesignEditingSession editingSession, ApicurioSessionContext session, BaseOperation bo) {
        SelectionOperation selectionOp = (SelectionOperation) bo;

        if (bo.getSource() == BaseOperation.SourceEnum.LOCAL) {
            processLocal(editingSession, session, selectionOp);
        } else {
            processRemote(editingSession, session, selectionOp);
        }
    }

    public void processLocal(ApiDesignEditingSession editingSession, ApicurioSessionContext session, SelectionOperation so) {
        String user = editingSession.getUser(session);
        String selection = so.getSelection();
        logger.debug("\tuser:" + user);
        logger.debug("\tselection:" + selection);
        editingSession.sendUserSelectionToOthers(session, user, selection);
        logger.debug("User selection propagated to 'other' clients.");
    }

    private void processRemote(ApiDesignEditingSession editingSession, ApicurioSessionContext session, SelectionOperation so) {
        editingSession.sendToAllSessions(session, so);
        logger.debug("Remote selection sent to local clients.");
    }

    @Override
    public String getOperationName() {
        return "selection";
    }

    @Override
    public Class<? extends BaseOperation> unmarshallKlazz() {
        return SelectionOperation.class;
    }
}
