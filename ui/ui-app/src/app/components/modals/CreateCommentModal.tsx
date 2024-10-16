import { FunctionComponent, useEffect, useState } from "react";
import { Button, Form, FormGroup, Modal, TextArea } from "@patternfly/react-core";
import { NewComment } from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";


/**
 * Properties
 */
export type CreateCommentModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onCreateComment: (value: NewComment) => void;
};

export const CreateCommentModal: FunctionComponent<CreateCommentModalProps> = (props: CreateCommentModalProps) => {
    const [value, setValue] = useState<string>("");

    const isValid: boolean = value !== undefined && value.trim().length > 0;

    useEffect(() => {
        if (props.isOpen) {
            setValue("");
        }
    }, [props.isOpen]);

    return (
        <Modal
            title="Add comment"
            variant="medium"
            isOpen={props.isOpen}
            onClose={props.onClose}
            className="add-comment pf-m-redhat-font"
            actions={[
                <Button key="add" variant="primary" data-testid="modal-btn-add" onClick={() => { props.onCreateComment({ value }); }} isDisabled={!isValid}>Add</Button>,
                <Button key="cancel" variant="link" data-testid="modal-btn-cancel" onClick={props.onClose}>Cancel</Button>
            ]}
        >
            <Form>
                <FormGroup label="Comment" fieldId="form-comment" isRequired={true}>
                    <TextArea
                        style={{ height: "100px" }}
                        isRequired={false}
                        id="form-comment"
                        data-testid="edit-metadata-modal-comment"
                        name="form-comment"
                        aria-describedby="form-comment-helper"
                        value={value}
                        placeholder="Enter a new comment"
                        onChange={(_evt, newValue) => setValue(newValue)}
                    />
                </FormGroup>
            </Form>
        </Modal>
    );

};
