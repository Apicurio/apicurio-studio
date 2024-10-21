import { FunctionComponent, useEffect, useState } from "react";
import { Button, Form, FormGroup, Modal, TextInput } from "@patternfly/react-core";
import { SearchedVersion } from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";

/**
 * Properties
 */
export type NewDraftFromModalProps = {
    fromVersion: SearchedVersion;
    isOpen: boolean;
    onClose: () => void;
    onCreate: (fromVersion: SearchedVersion, newVersionNumber: string) => void;
};

const deriveVersion = (fromVersion: string): string => {
    // TODO implement this
    return fromVersion;
};


export const NewDraftFromModal: FunctionComponent<NewDraftFromModalProps> = (props: NewDraftFromModalProps) => {
    const [newVersion, setNewVersion] = useState("");

    const isValid: boolean = true;

    useEffect(() => {
        if (props.isOpen) {
            setNewVersion(deriveVersion(props.fromVersion?.version || ""));
        }
    }, [props.isOpen]);

    return (
        <Modal
            title="Create new draft version"
            variant="medium"
            isOpen={props.isOpen}
            onClose={props.onClose}
            className="create-draft-from pf-m-redhat-font"
            description="Create a new draft from the content in this artifact version.  This will create a new editable version of the artifact."
            actions={[
                <Button key="create" variant="primary" data-testid="modal-btn-create" onClick={() => {
                    props.onCreate(props.fromVersion, newVersion); }} isDisabled={!isValid}>Create</Button>,
                <Button key="cancel" variant="link" data-testid="modal-btn-cancel" onClick={props.onClose}>Cancel</Button>
            ]}
        >
            <Form>
                <FormGroup label="New version" fieldId="form-version" isRequired={true}>
                    <TextInput
                        className="version"
                        isRequired={false}
                        type="text"
                        id="form-version"
                        data-testid="create-draft-modal-version"
                        name="form-version"
                        aria-describedby="form-version-helper"
                        value={newVersion}
                        placeholder="1.0.0 (optional) will be generated if left blank"
                        onChange={(_evt, value) => setNewVersion(value)}
                    />
                </FormGroup>
            </Form>
        </Modal>
    );

};
