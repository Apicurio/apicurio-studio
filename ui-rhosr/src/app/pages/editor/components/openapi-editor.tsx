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
import React, {RefObject} from "react";
import "./openapi-editor.css";
import {PureComponent, PureComponentProps, PureComponentState} from "../../../components";
import {Services} from "../../../../services";
import { BaseEditorProps } from "./base-editor";


/**
 * Properties
 */
export interface OpenApiEditorProps extends BaseEditorProps {
    className?: string;
    content: string;
    onChange: (newContent: string) => void;
}

/**
 * State
 */
// tslint:disable-next-line:no-empty-interface
export interface OpenApiEditorState extends PureComponentState {
}

/**
 * Models an OpenAPI editor.  This uses the external OpenAPI editor built in Angular to allow
 * graphical editing of an OpenAPI document.  The Angular component is loaded using an iframe.
 */
export class OpenApiEditor extends PureComponent<OpenApiEditorProps, OpenApiEditorState> {

    private ref: RefObject<any>;

    constructor(props: Readonly<OpenApiEditorProps>) {
        super(props);
        this.ref = React.createRef();
    }

    public componentDidMount() {
        Services.getLoggerService().debug("[OpenApiEditor] Component did MOUNT.");
    }

    public componentDidUpdate(prevProps: Readonly<OpenApiEditorProps>, prevState: Readonly<OpenApiEditorState>, snapshot?: {}) {
        Services.getLoggerService().debug("[OpenApiEditor] Component did UPDATE -- previous props: ", prevProps);
    }

    public postConstruct(): void {
        window.addEventListener("message", (event) => {
            if (event.data && event.data.type === "apicurio_onChange") {
                let newContent: any = event.data.data.content;
                if (typeof newContent === "object") {
                    newContent = JSON.stringify(newContent, null, 4);
                }
                this.props.onChange(newContent);
            }
        }, false);
    }

    public render(): React.ReactElement {
        return (
            <iframe id="openapi-editor-frame"
                    ref={ this.ref }
                    className={ this.props.className ? this.props.className : "openapi-editor-frame" }
                    onLoad={ this.onEditorLoaded }
                    src={ this.editorAppUrl() } />
        );
    }

    protected initializeState(): OpenApiEditorState {
        return {
        }
    }

    private editorAppUrl(): string {
        return Services.getConfigService().uiEditorAppUrl();
    }

    private onEditorLoaded = (): void => {
        // Now it's OK to post a message to iframe with the content to edit.
        const content: string = this.props.content;
        const message: any = {
            "type": "apicurio-editingInfo",
            // tslint:disable-next-line:object-literal-sort-keys
            "data": {
                "content": {
                    "format": "JSON",
                    "type": "OPENAPI",
                    "value": content
                },
                "features": {
                    "allowCustomValidations": false,
                    "allowImports": false
                }
            }
        }
        this.ref.current.contentWindow.postMessage(message, "*");
    };

}
