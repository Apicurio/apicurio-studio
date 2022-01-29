/**
 * @license
 * Copyright 2021 Red Hat
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
import React from 'react';
import "./pleaseWaitModal.css";
import {Modal, Spinner} from "@patternfly/react-core";
import {PureComponent, PureComponentProps, PureComponentState} from "../baseComponent";


/**
 * Properties
 */
export interface PleaseWaitModalProps extends PureComponentProps {
    message: string;
    isOpen: boolean;
}

/**
 * State
 */
// tslint:disable-next-line:no-empty-interface
export interface PleaseWaitModalState extends PureComponentState {
}

/**
 * Models the "please wait" modal.  This is shown when the user performs an asynchronous operation.
 */
export class PleaseWaitModal extends PureComponent<PleaseWaitModalProps, PleaseWaitModalState> {

    constructor(props: Readonly<PleaseWaitModalProps>) {
        super(props);
    }

    public render(): React.ReactElement {
        return (
            <Modal
                title="Please Wait"
                variant="small"
                isOpen={this.props.isOpen}
                header={<a href="#" />}
                showClose={false}
                className="please-wait pf-m-redhat-font"
                aria-label="please-wait-modal"
            >
                <Spinner size="md" className="spinner" />
                <span className="message">{ this.props.message }</span>
            </Modal>
        );
    }

    protected initializeState(): PleaseWaitModalState {
        return {};
    }

}
