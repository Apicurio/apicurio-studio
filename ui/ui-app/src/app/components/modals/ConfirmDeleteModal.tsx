import { FunctionComponent } from "react";
import { Button, Modal } from "@patternfly/react-core";


/**
 * Properties
 */
export type ConfirmDeleteModalProps = {
    title: string;
    message: string;
    isOpen: boolean;
    onDelete: () => void;
    onClose: () => void;
};

/**
 * A modal to prompt the user to delete something.
 */
export const ConfirmDeleteModal: FunctionComponent<ConfirmDeleteModalProps> = (props: ConfirmDeleteModalProps) => {

    return (
        <Modal
            title={props.title}
            variant="small"
            isOpen={props.isOpen}
            onClose={props.onClose}
            className="delete-confirm-modal pf-m-redhat-font"
            actions={[
                <Button key="delete" variant="primary" data-testid="modal-btn-delete" onClick={props.onDelete}>Delete</Button>,
                <Button key="cancel" variant="link" data-testid="modal-btn-cancel" onClick={props.onClose}>Cancel</Button>
            ]}
        >
            <p>{ props.message }</p>
        </Modal>
    );

};
