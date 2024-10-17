import { FunctionComponent, useEffect, useState } from "react";
import "./EditDraftInfoModal.css";
import {
    Button,
    Form,
    FormGroup,
    Grid,
    GridItem,
    Modal,
    TextArea,
    TextInput
} from "@patternfly/react-core";
import { DraftInfo } from "@models/drafts";



/**
 * Labels
 */
export type EditDraftInfoModalProps = {
    name: string;
    description: string;
    isOpen: boolean;
    onClose: () => void;
    onEdit: (info: DraftInfo) => void;
};

/**
 * Models the edit Draft Info modal dialog.
 */
export const EditDraftInfoModal: FunctionComponent<EditDraftInfoModalProps> = (props: EditDraftInfoModalProps) => {
    const [name, setName] = useState<string|undefined>("");
    const [description, setDescription] = useState("");
    const [isValid, setIsValid] = useState(true);

    const doEdit = (): void => {
        const data: DraftInfo = {
            name,
            description
        };
        props.onEdit(data);
    };

    const onNameChange = (_event: any, value: string): void => {
        setName(value);
    };

    const onDescriptionChange = (_event: any, value: string): void => {
        setDescription(value);
    };

    useEffect(() => {
        if (props.isOpen) {
            if (props.name !== undefined) {
                setName(props.name);
            }
            if (props.description !== undefined) {
                setDescription(props.description);
            }
            setIsValid(true);
        }
    }, [props.isOpen]);

    return (
        <Modal
            title="Edit Draft info"
            variant="large"
            isOpen={props.isOpen}
            onClose={props.onClose}
            className="edit-draftInfo pf-m-redhat-font"
            actions={[
                <Button key="edit" variant="primary" data-testid="modal-btn-edit" onClick={doEdit} isDisabled={!isValid}>Save</Button>,
                <Button key="cancel" variant="link" data-testid="modal-btn-cancel" onClick={props.onClose}>Cancel</Button>
            ]}
        >
            <Form>
                <Grid hasGutter md={6}>
                    <GridItem span={12}>
                        <FormGroup
                            label="Name"
                            fieldId="form-name"
                        >
                            <TextInput
                                isRequired={false}
                                type="text"
                                id="form-name"
                                data-testid="edit-draft-info-modal-name"
                                name="form-name"
                                aria-describedby="form-name-helper"
                                value={name}
                                placeholder="Name of the draft"
                                onChange={onNameChange}
                            />
                        </FormGroup>
                    </GridItem>
                    <GridItem span={12}>
                        <FormGroup
                            label="Description"
                            fieldId="form-description"
                        >
                            <TextArea
                                isRequired={false}
                                id="form-description"
                                data-testid="edit-draft-info-modal-description"
                                name="form-description"
                                aria-describedby="form-description-helper"
                                value={description}
                                placeholder="Description of the draft"
                                onChange={onDescriptionChange}
                            />
                        </FormGroup>
                    </GridItem>
                </Grid>
            </Form>
        </Modal>
    );
};
