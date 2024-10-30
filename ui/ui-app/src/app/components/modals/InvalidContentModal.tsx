import React, { FunctionComponent } from "react";
import "./InvalidContentModal.css";
import {
    Button,
    DataList,
    DataListCell,
    DataListItemCells,
    DataListItemRow,
    Modal,
    ModalVariant
} from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";
import { RuleViolationProblemDetails } from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";


/**
 * Properties
 */
export type InvalidContentModalProps = {
    error: RuleViolationProblemDetails|undefined;
    isOpen: boolean;
    onClose: () => void;
};

/**
 * Models the "invalid content" modal.  This is shown when the user tries to finalize a Draft
 * that is not valid.
 */
export const InvalidContentModal: FunctionComponent<InvalidContentModalProps> = (props: InvalidContentModalProps) => {

    const errorDetail = (): React.ReactElement => {
        if (props.error) {
            if (props.error.nameEscaped === "RuleViolationException" && props.error.causes != null && props.error.causes.length > 0 ) {
                return (
                    <DataList aria-label="Error causes" className="error-causes" >
                        {
                            props.error.causes.map( (cause, idx) =>
                                <DataListItemRow key={""+idx} className="error-causes-item">
                                    <DataListItemCells
                                        dataListCells={[
                                            <DataListCell key="error icon" className="type-icon-cell">
                                                <ExclamationCircleIcon/>
                                            </DataListCell>,
                                            <DataListCell key="main content">
                                                <div className="error-causes-item-title">
                                                    <span>{cause.context != null ? (<b>{cause.context}</b>) : cause.description}</span>
                                                </div>
                                                <div className="error-causes-item-description">{cause.context != null ? cause.description : cause.context }</div>
                                            </DataListCell>
                                        ]}
                                    />
                                </DataListItemRow>
                            )
                        }
                    </DataList>
                );
            } else if (props.error.detail) {
                return (
                    <pre className="error-detail">
                        {props.error.detail}
                    </pre>
                );
            }
        }
        return <p/>;
    };
    
    return (
        <Modal
            title="Invalid Content Error"
            variant={ModalVariant.large}
            isOpen={props.isOpen}
            onClose={props.onClose}
            className="edit-artifact-metaData pf-m-redhat-font"
            actions={[
                <Button key="close" variant="link" data-testid="modal-btn-close" onClick={props.onClose}>Close</Button>
            ]}
        >
            <p className="modal-desc" >The content of the draft you attempted to finalize violated one or more of the established content rules in Registry.</p>
            { errorDetail() }
        </Modal>
    );

};
