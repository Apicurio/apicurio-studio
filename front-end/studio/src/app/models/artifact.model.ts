/**
 * @license
 * Copyright 2020 JBoss Inc
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


// tslint:disable-next-line:interface-name
export class Artifact {

    id: string;
    type: string;
    state: string;
    name: string;
    version: number;
    description: string;
    labels: string[];
    createdOn: Date;
    createdBy: string;
    modifiedOn: Date;
    modifiedBy: string;
    __resourceType: string;

    constructor() {
        this.id = "";
        this.type = "";
        this.state = ""
        this.name = "";
        this.version = 1;
        this.description = "";
        this.labels = null;
        this.createdOn = new Date();
        this.createdBy = "";
        this.modifiedOn = new Date();
        this.modifiedBy = "";
        this.__resourceType = "ARTIFACT";
    }

}

export class ArtifactDefinition extends Artifact {

    spec: any;

    constructor() {
        super();
        this.spec = {};
    }

    public static fromArtifact(artifact: Artifact): ArtifactDefinition {
        let artifactDefinition: ArtifactDefinition = new ArtifactDefinition();
        artifactDefinition.id = artifact.id;
        artifactDefinition.type = artifact.type;
        artifactDefinition.state = artifact.state;
        artifactDefinition.name = artifact.name;
        artifactDefinition.version = artifact.version;
        artifactDefinition.description = artifact.description;
        artifactDefinition.labels = artifact.labels;
        artifactDefinition.createdOn = artifact.createdOn;
        artifactDefinition.createdBy = artifact.createdBy;
        artifactDefinition.modifiedOn = artifact.modifiedOn;
        artifactDefinition.modifiedBy = artifact.modifiedBy;
        artifactDefinition.__resourceType = artifact.__resourceType;

        return artifactDefinition;
    }

}