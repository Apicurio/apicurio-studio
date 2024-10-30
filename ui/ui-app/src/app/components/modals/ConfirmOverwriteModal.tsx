import { FunctionComponent } from "react";
import { Alert, Button, Modal } from "@patternfly/react-core";


/**
 * Properties
 */
export type ConfirmOverwriteModalProps = {
    isOpen: boolean;
    onOverwrite: () => void;
    onClose: () => void;
};

/**
 * A modal to prompt the user to delete something.
 */
export const ConfirmOverwriteModal: FunctionComponent<ConfirmOverwriteModalProps> = (props: ConfirmOverwriteModalProps) => {

    return (
        <Modal
            title="Overwrite changed content?"
            variant="medium"
            isOpen={props.isOpen}
            onClose={props.onClose}
            className="overwrite-confirm-modal pf-m-redhat-font"
            actions={[
                <Button key="overwrite" variant="primary" data-testid="modal-btn-overwrite"
                    onClick={props.onOverwrite}>Overwrite</Button>,
                <Button key="cancel" variant="link" data-testid="modal-btn-cancel"
                    onClick={props.onClose}>Cancel</Button>
            ]}
        >
            <p style={{ marginBottom: "20px" }}>
                The content of this draft has changed since you last loaded it into the editor. This typically
                means that someone else has changed the content, and <b>saving now would overwrite their changes</b>.
            </p>
            <Alert
                variant="warning"
                title="Alert: Content changed!"
            >
                <p>
                    <em>Do you want to save the draft anyway, potentially overwriting someone else's changes?</em>
                </p>
            </Alert>
            <div>
                &nbsp;
            </div>
        </Modal>
    );

};
