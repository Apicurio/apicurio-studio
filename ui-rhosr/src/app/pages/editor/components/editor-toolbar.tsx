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
import "./editor-toolbar.css";
import {PureComponent, PureComponentProps, PureComponentState} from "../../../components";
import {Button, Toolbar, ToolbarContent, ToolbarItem} from "@patternfly/react-core";
import {ArtifactMetaData} from "../../../../models/artifactMetaData.model";


/**
 * Properties
 */
export interface EditorToolbarProps extends PureComponentProps {
    artifactMetaData: ArtifactMetaData;
    className?: string;
    saveButtonLabel: string;
    revertButtonLabel: string;
    onSave: () => void;
}

/**
 * State
 */
// tslint:disable-next-line:no-empty-interface
export interface EditorToolbarState extends PureComponentState {
}

/**
 * Models a toolbar that is shown along with an editor.  The toolbar provides a way for the
 * user to e.g. save the content.
 */
export class EditorToolbar extends PureComponent<EditorToolbarProps, EditorToolbarState> {

    constructor(props: Readonly<EditorToolbarProps>) {
        super(props);
    }

    public render(): React.ReactElement {
        return (
            <Toolbar id="editor-toolbar" isSticky={true} className={ this.props.className ? this.props.className : "editor-toolbar" }>
                <ToolbarContent>
                    <ToolbarItem>
                        <span>You have made changes to&nbsp;</span>
                        <span className="groupId">{ this.props.artifactMetaData.groupId ? this.props.artifactMetaData.groupId : "default" }</span>
                        <span>&nbsp;/&nbsp;</span>
                        <span className="artifactId">{ this.props.artifactMetaData.id }</span>
                        <span>&nbsp;(current version is&nbsp;</span>
                        <span className="version">{ this.props.artifactMetaData.version }</span>
                        <span>&nbsp;).</span>
                    </ToolbarItem>
                    <ToolbarItem alignment={ { default: "alignRight" } }>
                        <Button onClick={ this.props.onSave } variant="primary">{ this.props.saveButtonLabel }</Button>
                    </ToolbarItem>
                </ToolbarContent>
            </Toolbar>
        );
    }

    protected initializeState(): EditorToolbarState {
        return {}
    }

}
