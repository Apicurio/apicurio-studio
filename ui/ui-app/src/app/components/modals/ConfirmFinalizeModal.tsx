import { FunctionComponent } from "react";
import { Button, Modal } from "@patternfly/react-core";
import { Draft } from "@models/drafts";


/**
 * Properties
 */
export type ConfirmFinalizeModalProps = {
    draft: Draft | undefined;
    isOpen: boolean;
    onFinalize: (draft: Draft) => void;
    onClose: () => void;
};

/**
 * A modal to prompt the user to delete something.
 */
export const ConfirmFinalizeModal: FunctionComponent<ConfirmFinalizeModalProps> = (props: ConfirmFinalizeModalProps) => {

    return (
        <Modal
            title="Finalize draft?"
            variant="small"
            isOpen={props.isOpen}
            onClose={props.onClose}
            className="finalize-confirm-modal pf-m-redhat-font"
            actions={[
                <Button key="finalize" variant="primary" data-testid="modal-btn-finalize" onClick={() => props.onFinalize(props.draft!)}>Finalize</Button>,
                <Button key="cancel" variant="link" data-testid="modal-btn-cancel" onClick={props.onClose}>Cancel</Button>
            ]}
        >
            <p>
                Finalize '{props.draft?.draftId}' from draft to final state?  This will run any configured Rules and then "finalize"
                the draft to the enabled state.  This action cannot be undone.
            </p>
        </Modal>
    );

};
