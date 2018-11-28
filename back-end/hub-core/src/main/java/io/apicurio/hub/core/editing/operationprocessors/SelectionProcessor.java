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

    @Override
    public void processLocal(ApiDesignEditingSession editingSession, ApicurioSessionContext session, BaseOperation bo) {
        SelectionOperation selectionOperation = (SelectionOperation) bo;
        String user = editingSession.getUser(session);
        String selection = selectionOperation.getSelection();
        logger.debug("\tuser:" + user);
        logger.debug("\tselection:" + selection);
        editingSession.sendUserSelectionToOthers(session, user, selection);
        logger.debug("User selection propagated to 'other' clients.");
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
