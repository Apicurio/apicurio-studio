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
import "./artifactTypeIcon.css";
import {PureComponent, PureComponentProps, PureComponentState} from "../baseComponent";
import {ArtifactTypes} from "../../../models/artifactTypes.model";

/**
 * Properties
 */
export interface ArtifactTypeIconProps extends PureComponentProps {
    type: string;
}

/**
 * State
 */
// tslint:disable-next-line:no-empty-interface
export interface ArtifactTypeIconState extends PureComponentState {
}


/**
 * Models the list of artifacts.
 */
export class ArtifactTypeIcon extends PureComponent<ArtifactTypeIconProps, ArtifactTypeIconState> {

    constructor(props: Readonly<ArtifactTypeIconProps>) {
        super(props);
    }

    public render(): React.ReactElement {
        return (
            <div className={this.getClassNames()} title={this.getTitle()} />
        );
    }

    protected initializeState(): ArtifactTypeIconState {
        return {};
    }

    private getTitle(): string {
        let title: string = this.props.type;
        switch (this.props.type) {
            case ArtifactTypes.AVRO:
                title = "Avro Schema";
                break;
            case ArtifactTypes.PROTOBUF:
                title = "Protobuf Schema";
                break;
            case ArtifactTypes.JSON:
                title = "JSON Schema";
                break;
            case ArtifactTypes.OPENAPI:
                title = "OpenAPI Definition";
                break;
            case ArtifactTypes.ASYNCAPI:
                title = "AsyncAPI Definition";
                break;
            case ArtifactTypes.GRAPHQL:
                title = "GraphQL Definition";
                break;
            case ArtifactTypes.KCONNECT:
                title = "Kafka Connect Schema";
                break;
            case ArtifactTypes.WSDL:
                title = "WSDL";
                break;
            case ArtifactTypes.XSD:
                title = "XML Schema";
                break;
            case ArtifactTypes.XML:
                title = "XML";
                break;
        }
        return title;
    }

    private getClassNames(): string {
        let classes: string = "artifact-type-icon";
        switch (this.props.type) {
            case ArtifactTypes.AVRO:
                classes += " avro-icon16";
                break;
            case ArtifactTypes.PROTOBUF:
                classes += " protobuf-icon16";
                break;
            case ArtifactTypes.JSON:
                classes += " json-icon16";
                break;
            case ArtifactTypes.OPENAPI:
                classes += " oai-icon16";
                break;
            case ArtifactTypes.ASYNCAPI:
                classes += " aai-icon16";
                break;
            case ArtifactTypes.GRAPHQL:
                classes += " graphql-icon16";
                break;
            case ArtifactTypes.KCONNECT:
                classes += " kconnect-icon16";
                break;
            case ArtifactTypes.WSDL:
                classes += " xml-icon16";
                break;
            case ArtifactTypes.XSD:
                classes += " xml-icon16";
                break;
            case ArtifactTypes.XML:
                classes += " xml-icon16";
                break;
        }
        return classes;
    }

}

export default ArtifactTypeIcon;
