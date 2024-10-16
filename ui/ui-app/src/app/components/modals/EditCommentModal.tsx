import { FunctionComponent, useEffect, useState } from "react";
import { Button, Form, FormGroup, Modal, TextArea } from "@patternfly/react-core";
import { NewComment, Comment } from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";


/**
 * Properties
 */
export type EditCommentModalProps = {
    comment: Comment;
    isOpen: boolean;
    onClose: () => void;
    onEditComment: (commentId: string, value: NewComment) => void;
};

export const EditCommentModal: FunctionComponent<EditCommentModalProps> = (props: EditCommentModalProps) => {
    const [value, setValue] = useState<string>("");

    const isValid: boolean = value !== undefined && value.trim().length > 0;

    useEffect(() => {
        if (props.isOpen) {
            setValue(props.comment.value!);
        }
    }, [props.isOpen]);

    return (
        <Modal
            title="Edit comment"
            variant="medium"
            isOpen={props.isOpen}
            onClose={props.onClose}
            className="edit-comment pf-m-redhat-font"
            actions={[
                <Button key="edit" variant="primary" data-testid="modal-btn-edit" onClick={() => {
                    props.onEditComment(props.comment.commentId!, { value }); }} isDisabled={!isValid}>Edit</Button>,
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
                        placeholder="Edit the comment"
                        onChange={(_evt, newValue) => setValue(newValue)}
                    />
                </FormGroup>
            </Form>
        </Modal>
    );

};
