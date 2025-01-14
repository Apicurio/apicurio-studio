import { FunctionComponent, useEffect, useState } from "react";
import { Button, Modal, Switch, Tooltip } from "@patternfly/react-core";
import { Draft } from "@models/drafts";


/**
 * Properties
 */
export type ConfirmFinalizeModalProps = {
    draft: Draft | undefined;
    isOpen: boolean;
    onFinalize: (draft: Draft, dryRun?: boolean) => void;
    onClose: () => void;
};

/**
 * A modal to prompt the user to delete something.
 */
export const ConfirmFinalizeModal: FunctionComponent<ConfirmFinalizeModalProps> = (props: ConfirmFinalizeModalProps) => {
    const [isDryRun, setIsDryRun] = useState(false);

    const onDryRunChange = (_event: React.FormEvent<HTMLInputElement>, checked: boolean) => {
        setIsDryRun(checked);
    };

    useEffect(() => {
        if (props.isOpen) {
            setIsDryRun(false);
        }
    }, [props.isOpen]);

    const finalizeButtonLabel: string = isDryRun ? "Finalize (dry run)" : "Finalize";

    return (
        <Modal
            title="Finalize draft?"
            variant="small"
            isOpen={props.isOpen}
            onClose={props.onClose}
            className="finalize-confirm-modal pf-m-redhat-font"
            actions={[
                <Button key="finalize" variant="primary" data-testid="modal-btn-finalize"
                    onClick={() => props.onFinalize(props.draft!, isDryRun)}>{finalizeButtonLabel}</Button>,
                <Button key="cancel" variant="link" data-testid="modal-btn-cancel"
                    onClick={props.onClose}>Cancel</Button>
            ]}
        >
            <p>
                Finalize '{props.draft?.draftId}' from draft to final state? This will run any configured Rules and then
                "finalize"
                the draft to the enabled state. This action cannot be undone.
            </p>
            <p style={{ marginTop: "12px" }}>
                <Tooltip content={<span>Enabling this option will cause the Finalize action to be fully executed but not <b>persisted</b>.  Notably, this will run all of the configured content rules for the Draft without actually changing the Draft state.</span>}>
                    <Switch
                        id="dryrun-switch"
                        label="Dry run only"
                        labelOff="Dry run only"
                        isChecked={isDryRun}
                        onChange={onDryRunChange}
                        ouiaId="DryRunSwitch" />
                </Tooltip>
            </p>
        </Modal>
    );

};
