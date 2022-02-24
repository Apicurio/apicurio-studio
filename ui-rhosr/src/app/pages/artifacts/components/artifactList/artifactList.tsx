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
import "./artifactList.css";
import {DataList} from '@patternfly/react-core';
import {PureComponent, PureComponentProps, PureComponentState} from "../../../../components";
import {SearchedArtifact} from "../../../../../models/searchedArtifact.model";
import {ArtifactListItem} from "./artifactListItem";
import {RegistryInstance} from "../../../../../models";

/**
 * Properties
 */
export interface ArtifactListProps extends PureComponentProps {
    artifacts: SearchedArtifact[];
    registry: RegistryInstance;
}

/**
 * State
 */
// tslint:disable-next-line:no-empty-interface
export interface ArtifactListState extends PureComponentState {
}


/**
 * Models the list of artifacts.
 */
export class ArtifactList extends PureComponent<ArtifactListProps, ArtifactListState> {

    constructor(props: Readonly<ArtifactListProps>) {
        super(props);
    }

    public render(): React.ReactElement {
        return (
            <DataList aria-label="Expandable data list example" className="artifact-list">
                {
                    this.props.artifacts.map( (artifact, idx) =>
                        <ArtifactListItem key={idx} registry={this.props.registry} artifact={artifact} />
                    )
                }
            </DataList>
        );
    }

    protected initializeState(): ArtifactListState {
        return {
        };
    }

}
