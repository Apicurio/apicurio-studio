/**
 * @license
 * Copyright 2022 Red Hat
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from "react";
import {PureComponent, PureComponentProps, PureComponentState} from "../../../components";
import {Button, Modal} from "@patternfly/react-core";


/**
 * Properties
 */
export interface SaveModalProps extends PureComponentProps {
    isOpen: boolean;
    onSave: () => void;
    onClose: () => void;
}

/**
 * State
 */
// tslint:disable-next-line:no-empty-interface
export interface SaveModalState extends PureComponentState {
}

/**
 * Models a toolbar that is shown along with an editor.  The toolbar provides a way for the
 * user to e.g. save the content.
 */
export class SaveModal extends PureComponent<SaveModalProps, SaveModalState> {

    constructor(props: Readonly<SaveModalProps>) {
        super(props);
    }

    public render(): React.ReactElement {
        return (
            <Modal
                title="Save to registry"
                variant="small"
                isOpen={this.props.isOpen}
                onClose={this.props.onClose}
                className="save-artifact pf-m-redhat-font"
                actions={[
                    <Button key="edit" variant="primary" data-testid="modal-btn-edit" onClick={this.props.onSave}>Save</Button>,
                    <Button key="cancel" variant="link" data-testid="modal-btn-cancel" onClick={this.props.onClose}>Cancel</Button>
                ]}
            >
                <p>Save your changes back to the Service Registry instance as a new version of the same artifact?</p>
            </Modal>
        );
    }

    protected initializeState(): SaveModalState {
        return {}
    }

}
