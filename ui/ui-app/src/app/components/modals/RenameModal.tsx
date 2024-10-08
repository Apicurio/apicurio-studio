import { FunctionComponent, useEffect, useState } from "react";
import { Button, Form, FormGroup, Modal, ModalVariant, TextArea, TextInput } from "@patternfly/react-core";
import { Design } from "@models/designs";

export type RenameData = {
    name: string;
    description: string;
};

export type RenameModalProps = {
    design: Design | undefined;
    isOpen: boolean | undefined;
    onRename: (event: RenameData) => void;
    onCancel: () => void;
}


export const RenameModal: FunctionComponent<RenameModalProps> = (
    { design, isOpen, onRename, onCancel }: RenameModalProps) => {

    const [isValid, setValid] = useState(false);
    const [name, setName] = useState<string>();
    const [description, setDescription] = useState<string>();

    // Called when the user clicks "edit"
    const doRename = () => {
        onRename({
            name: name as string,
            description: description as string
        });
    };

    useEffect(() => {
        if (isOpen) {
            setName(design?.name);
            setDescription(design?.description);
        }
    }, [isOpen]);

    // Set the validity whenever one of the relevant state variables changes.
    useEffect(() => {
        let valid: boolean = true;
        if (!name) {
            valid = false;
        }
        setValid(valid);
    }, [name, description]);

    return (
        <Modal
            variant={ModalVariant.medium}
            title="Edit design metadata"
            isOpen={isOpen}
            onClose={onCancel}
            actions={[
                <Button key="edit" variant="primary" isDisabled={!isValid} onClick={doRename}>Save</Button>,
                <Button key="cancel" variant="link" onClick={onCancel}>Cancel</Button>
            ]}
        >
            <Form>
                <FormGroup label="Name" isRequired={true} fieldId="edit-name">
                    <TextInput
                        isRequired
                        type="text"
                        id="edit-name"
                        name="edit-name"
                        placeholder="Enter new name for design"
                        aria-describedby="edit-name-helper"
                        value={name}
                        onChange={(_event, value) => setName(value)}
                    />
                </FormGroup>
                <FormGroup label="Description" fieldId="edit-description">
                    <TextArea
                        type="text"
                        id="edit-description"
                        name="edit-description"
                        aria-describedby="edit-description-helper"
                        value={description}
                        onChange={(_event, value) => {setDescription(value);}}
                    />
                </FormGroup>
            </Form>
        </Modal>
    );
};
