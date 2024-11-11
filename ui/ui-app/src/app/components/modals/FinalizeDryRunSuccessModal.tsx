import { FunctionComponent } from "react";
import { Button, Modal } from "@patternfly/react-core";


/**
 * Properties
 */
export type FinalizeDryRunSuccessModalProps = {
    isOpen: boolean;
    onClose: () => void;
};


export const FinalizeDryRunSuccessModal: FunctionComponent<FinalizeDryRunSuccessModalProps> = (props: FinalizeDryRunSuccessModalProps) => {

    return (
        <Modal
            title="Finalize successful (dry run)"
            variant="small"
            isOpen={props.isOpen}
            onClose={props.onClose}
            className="finalize-success-modal pf-m-redhat-font"
            actions={[
                <Button key="close" variant="link" data-testid="modal-btn-close" onClick={props.onClose}>Close</Button>
            ]}
        >
            <p>
                A dry run of finalizing the draft completed successfully (all configured content rules for the
                draft passed).
            </p>
        </Modal>
    );

};
