import { FunctionComponent, useEffect, useState } from "react";
import {
    Alert,
    Button,
    Checkbox,
    Form,
    FormGroup,
    Modal,
    ModalVariant,
    Text,
    TextContent
} from "@patternfly/react-core";
import { Design } from "@models/designs";

export type DeleteDesignModalProps = {
    design: Design | undefined;
    isOpen: boolean | undefined;
    onDelete: (design: Design) => void;
    onCancel: () => void;
    onDownload: (design: Design) => void;
}

export const DeleteDesignModal: FunctionComponent<DeleteDesignModalProps> = ({ design, isOpen, onDelete, onDownload, onCancel }: DeleteDesignModalProps) => {
    const [isValid, setValid] = useState(false);

    // Called when the user clicks the Delete button in the modal
    const doDelete = (): void => {
        onDelete(design as Design);
    };

    const doDownload = (): void => {
        onDownload(design as Design);
    };

    useEffect(() => {
        setValid(false);
    }, [design, isOpen]);

    return (
        <Modal
            variant={ModalVariant.small}
            title="Delete design?"
            titleIconVariant="warning"
            isOpen={isOpen}
            onClose={onCancel}
            actions={[
                <Button key="delete" variant="primary" isDisabled={!isValid} onClick={doDelete} data-testid="btn-modal-delete">
                    Delete
                </Button>,
                <Button key="cancel" variant="link" onClick={onCancel} data-testid="btn-modal-cancel">
                    Cancel
                </Button>
            ]}
        >
            <TextContent style={{ marginBottom: "15px" }}>
                <Text component="p">The following API or schema design will be deleted.</Text>
            </TextContent>

            <Form>
                <FormGroup label="Name" fieldId="delete-design-name">
                    <TextContent data-testid="text-design-name">{design?.name}</TextContent>
                </FormGroup>
                <FormGroup label="Description" fieldId="delete-design-description">
                    <TextContent data-testid="text-design-description">{design?.description}</TextContent>
                </FormGroup>
                <FormGroup fieldId="delete-design-warning">
                    <Alert isInline variant="info" title="To save your data for future use, download the design.">
                        <p style={{ lineHeight: "18px" }}>
                            To ensure your data is successfully saved, wait for the download to complete
                            before deleting the design.
                        </p>
                        <Button
                            variant="link"
                            onClick={doDownload}
                            data-testid="btn-download-design"
                            style={{ paddingLeft: "0px" }}
                        >Download design</Button>
                    </Alert>
                </FormGroup>
                <FormGroup fieldId="delete-design-confirm">
                    <Checkbox
                        id="valid-checkbox"
                        name=""
                        data-testid="checkbox-confirm-delete"
                        label="I understand that the design will be permanently deleted."
                        isChecked={isValid} onChange={(_event, checked) => setValid(checked)}
                    />
                </FormGroup>
            </Form>
        </Modal>
    );
};
