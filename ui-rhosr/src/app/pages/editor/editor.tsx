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
import "./editor.css";
import {PageComponent, PageProps, PageState} from "../basePage";
import {PageSection, PageSectionVariants} from "@patternfly/react-core";
import {OpenApiEditor} from "./components/openapi-editor";
import {GraphQLSchemaEditor} from "./components/graphql-editor";
import {BasicEditor} from "./components/basic-editor";
import {Services} from "../../../services";
import {ArtifactMetaData} from "../../../models/artifactMetaData.model";
import {EditorToolbar} from "./components/editor-toolbar";
import {If, PleaseWaitModal} from "../../components";
import {SaveModal} from "./components/save-modal";
import {RegistryInstance} from "../../../models";
import { BaseEditor } from "./components/base-editor";

interface RegistryCoordinates {
    registryId: string;
    groupId: string;
    artifactId: string;
}

interface EditorContentSource {
    type: 'registry' | 'url';
    registry?: RegistryCoordinates;
    url?: string;
}

/**
 * Properties
 */
// tslint:disable-next-line:no-empty-interface
export interface EditorPageProps extends PageProps {

}

/**
 * State
 */
// tslint:disable-next-line:no-empty-interface
export interface EditorPageState extends PageState {
    source: EditorContentSource | null;
    registry: RegistryInstance | null;
    artifactMetaData: ArtifactMetaData | null;
    originalContent: string | null;
    content: string | null;
    isDirty: boolean;
    isSaveModalOpen: boolean;
    isPleaseWaitModalOpen: boolean;
    pleaseWaitMessage: string;
}

/**
 * The Editor page.
 */
export class EditorPage extends PageComponent<EditorPageProps, EditorPageState> {

    constructor(props: Readonly<EditorPageProps>) {
        super(props);
    }

    public renderPage(): React.ReactElement {
        return (
            <React.Fragment>
                <PageSection className="ps_rules-header"
                             variant={PageSectionVariants.light}
                             padding={{default:"noPadding"}}
                             hasOverflowScroll={false}
                             isFilled={true} >
                    <div className="editor-flex-container">
                        <If condition={ this.state.isDirty }>
                            <EditorToolbar onSave={ this.onSave }
                                           className="editor-flex-toolbar"
                                           artifactMetaData={ this.state.artifactMetaData as ArtifactMetaData }
                                           saveButtonLabel="Save changes"
                                           revertButtonLabel="Revert changes" />
                        </If>
                        <BaseEditor onChange={this.onEditorChange} content={this.state.content} artifactType={this.state.artifactMetaData?.type}/>
                    </div>
                </PageSection>
                <SaveModal onSave={ this.doSave } onClose={ this.cancelSave } isOpen={ this.state.isSaveModalOpen } />
                <PleaseWaitModal message={this.state.pleaseWaitMessage}
                                 isOpen={this.state.isPleaseWaitModalOpen} />
            </React.Fragment>
        );
    }

    protected initializePageState(): EditorPageState {
        let source: EditorContentSource | null = null;

        // @ts-ignore
        const location: any = this.props.history.location;
        if (location && location.search) {
            const params = new URLSearchParams(location.search);
            if (params.get("type") === "registry") {
                source = {
                    registry: {
                        artifactId: params.get("artifactId") as string,
                        groupId: params.get("groupId") as string,
                        registryId: params.get("registryId") as string
                    },
                    type: "registry"
                };
            } else if (params.get("type") === "registry") {
                source = {
                    type: "registry",
                    url: params.get("url") as string
                };
            }
        }

        return {
            artifactMetaData: null,
            content: null,
            isDirty: false,
            isPleaseWaitModalOpen: false,
            isSaveModalOpen: false,
            originalContent: null,
            pleaseWaitMessage: "",
            registry: null,
            source
        };
    }

    // @ts-ignore
    protected createLoaders(): Promise {
        if (this.state.source?.type === "registry") {
            const registryId: string = this.state.source.registry?.registryId as string;
            const groupId: string = this.state.source.registry?.groupId as string;
            const artifactId: string = this.state.source.registry?.artifactId as string;

            return Services.getRegistriesService().getRegistry(registryId).then(registry => {
                this.setSingleState("registry", registry);
                return Promise.all([
                    Services.getRegistryService().getArtifactContent(registry, groupId, artifactId).then(content => {
                        this.setMultiState({
                            content,
                            originalContent: content
                        });
                    }).catch(error => {
                        this.handleServerError(error, "Error loading artifact content.");
                    }),
                    Services.getRegistryService().getArtifactMetaData(registry, groupId, artifactId).then(metaData => {
                        this.setSingleState("artifactMetaData", metaData);
                    }).catch(error => {
                        this.handleServerError(error, "Error loading artifact meta-data.");
                    })
                ]);
            }).catch(error => {
                this.handleServerError(error, "Error loading registry information.");
            });
        } else if (this.state.source?.type === "url") {
            // TODO implement support for loading content from a plain URL
            return Promise.reject("Loading content from URL not yet supported.");
        } else {
            return Promise.reject("Unsupported data source type: " + this.state.source?.type);
        }
    }

    private onEditorChange = (newContent: string): void => {
        this.setMultiState({
            content: newContent,
            isDirty: true
        });
        this.setSingleState("content", newContent);
    };

    private onSave = (): void => {
        Services.getLoggerService().debug("[EditorPage] Saving content!");
        this.setSingleState("isSaveModalOpen", true);
    };

    private doSave = (): void => {
        this.setSingleState("isSaveModalOpen", false);
        this.pleaseWait(true, "Saving artifact, please wait.");
        const groupId: string = this.state.source?.registry?.groupId as string;
        const artifactId: string = this.state.source?.registry?.artifactId as string;
        Services.getRegistryService().updateArtifactContent(this.state.registry as RegistryInstance, {
            type: this.state.artifactMetaData?.type,
            groupId,
            artifactId,
            content: this.state.content as string
        }).then(vmd => {
            this.setMultiState({
                artifactMetaData: {
                    ...vmd,
                    createdBy: this.state.artifactMetaData?.createdBy,
                    createdOn: this.state.artifactMetaData?.createdOn,
                    modifiedBy: vmd.createdBy,
                    modifiedOn: vmd.createdOn
                },
                isDirty: false
            });
            this.pleaseWait(false, "");
        }).catch(error => {
            this.handleServerError(error, "Error saving/updating artifact.");
        });
    };

    private cancelSave = (): void => {
        this.setSingleState("isSaveModalOpen", false);
    };

    private pleaseWait = (isOpen: boolean, message: string): void => {
        this.setMultiState({
            isPleaseWaitModalOpen: isOpen,
            pleaseWaitMessage: message
        });
    };

}