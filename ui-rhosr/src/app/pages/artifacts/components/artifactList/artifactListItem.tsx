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
import "./artifactListItem.css";
import {ArtifactTypeIcon, PureComponent, PureComponentProps, PureComponentState} from "../../../../components";
import {
    Badge,
    Button,
    DataListCell,
    DataListContent,
    DataListItem,
    DataListItemCells,
    DataListItemRow,
    DataListToggle,
    DataListWrapModifier
} from "@patternfly/react-core";
import {SearchedArtifact} from "../../../../../models/searchedArtifact.model";
import {ArtifactGroup} from "./artifactGroup";
import {ArtifactName} from "./artifactName";
import {ExternalLinkSquareAltIcon} from "@patternfly/react-icons";
import {RegistryInstance} from "../../../../../models";

/**
 * Properties
 */
export interface ArtifactListItemProps extends PureComponentProps {
    artifact: SearchedArtifact;
    registry: RegistryInstance;
}

/**
 * State
 */
// tslint:disable-next-line:no-empty-interface
export interface ArtifactListItemState extends PureComponentState {
    isExpanded: boolean;
}


/**
 * Models a single row in the list of artifacts.
 */
export class ArtifactListItem extends PureComponent<ArtifactListItemProps, ArtifactListItemState> {

    constructor(props: Readonly<ArtifactListItemProps>) {
        super(props);
    }

    public render(): React.ReactElement {
        return (
            <DataListItem isExpanded={this.state.isExpanded} className="artifact-list-item">
                <DataListItemRow>
                    <DataListToggle
                        onClick={this.toggle}
                        isExpanded={this.state.isExpanded}
                        id="data-list-item-toggle"
                    />
                    <DataListItemCells
                        dataListCells={[
                            <DataListCell isIcon={true} key="icon">
                                <ArtifactTypeIcon type={this.props.artifact.type}/>
                            </DataListCell>,
                            <DataListCell key="primary content" wrapModifier={DataListWrapModifier.breakWord}>
                                 <div className="artifact-title">
                                     <ArtifactGroup groupId={this.props.artifact.groupId} />
                                     <ArtifactName groupId={this.props.artifact.groupId} id={this.props.artifact.id} name={this.props.artifact.name} />
                                     {
                                         this.statuses().map( status =>
                                             <Badge className="status-badge" key={status} isRead={true}>{status}</Badge>
                                         )
                                     }
                                 </div>
                            </DataListCell>,
                            <DataListCell key="secondary content">
                                <div className="artifact-tags">
                                    {
                                        this.labels().map( label =>
                                            <Badge key={label} isRead={true}>{label}</Badge>
                                        )
                                    }
                                </div>
                            </DataListCell>,
                        ]}
                    />
                </DataListItemRow>
                <DataListContent
                    aria-label="Artifact details"
                    isHidden={ !this.state.isExpanded }
                >
                    <div className="artifact-details">
                        <div className="label description-label">Description</div>
                        <div className="description">{ this.description() }</div>
                        <div className="label actions-label">Actions</div>
                        <div className="actions">
                            <Button variant="primary" onClick={this.navigateTo(this.editorLink())}>Edit artifact</Button>
                            <Button variant="link" icon={<ExternalLinkSquareAltIcon />} iconPosition="right">View in registry</Button>
                        </div>
                    </div>
                </DataListContent>
            </DataListItem>
        );
    }

    protected initializeState(): ArtifactListItemState {
        return {
            isExpanded: false
        };
    }

    private toggle = () : void => {
        this.setSingleState("isExpanded", !this.state.isExpanded);
    }

    private labels(): string[] {
        return this.props.artifact.labels ? this.props.artifact.labels : [];
    }

    private statuses(): string[] {
        const rval: string[] = [];
        if (this.props.artifact.state === "DISABLED") {
            rval.push("Disabled");
        }
        if (this.props.artifact.state === "DEPRECATED") {
            rval.push("Deprecated");
        }
        return rval;
    }

    private description(): string {
        if (this.props.artifact.description) {
            return this.props.artifact.description;
        }
        return `An artifact of type ${this.props.artifact.type} with no description.`;
    }

    private editorLink(): string {
        const groupId: string = this.props.artifact.groupId == null ? "default" : this.props.artifact.groupId;
        const link: string = `/editor?type=registry&registryId=${encodeURIComponent(this.props.registry.id)}&groupId=${ encodeURIComponent(groupId)}&artifactId=${ encodeURIComponent(this.props.artifact.id) }`;
        return this.linkTo(link);
    }

}
