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
import "./artifacts.css";
import {Flex, FlexItem, PageSection, PageSectionVariants, Spinner} from '@patternfly/react-core';
import {PageComponent, PageProps, PageState} from "../basePage";
import {Services} from "../../../services";
import {RegistryInstance} from "../../../models";
import {Paging} from "../../../models/paging.model";
import {ArtifactsSearchResults} from "../../../models/artifactsSearchResults.model";
import {
    ArtifactList,
    ArtifactsPageEmptyState,
    ArtifactsPageToolbar,
    ArtifactsPageToolbarFilterCriteria
} from "./components";
import {GetArtifactsCriteria} from "../../../models/getArtifactsCriteria.model";
import {If} from "../../components";
import {SearchedArtifact} from "../../../models/searchedArtifact.model";


/**
 * Properties
 */
// tslint:disable-next-line:no-empty-interface
export interface ArtifactsPageProps extends PageProps {
}

/**
 * State
 */
// tslint:disable-next-line:no-empty-interface
export interface ArtifactsPageState extends PageState {
    registries: RegistryInstance[] | null;
    criteria: ArtifactsPageToolbarFilterCriteria;
    isPleaseWaitModalOpen: boolean;
    isSearching: boolean;
    paging: Paging;
    results: ArtifactsSearchResults | null;
    selectedRegistry: RegistryInstance | null;
}

/**
 * The artifacts page.
 */
export class ArtifactsPage extends PageComponent<ArtifactsPageProps, ArtifactsPageState> {

    constructor(props: Readonly<ArtifactsPageProps>) {
        super(props);
    }

    public renderPage(): React.ReactElement {
        return (
            <React.Fragment>
                <PageSection variant={PageSectionVariants.light} padding={{default : "noPadding"}}>
                    <ArtifactsPageToolbar registries={this.state.registries}
                                          selectedRegistry={this.state.selectedRegistry}
                                          artifacts={this.results()}
                                          criteria={this.state.criteria}
                                          paging={this.state.paging}
                                          onRegistryChange={this.onRegistryChange}
                                          onPerPageSelect={this.onPerPageSelect}
                                          onSetPage={this.onSetPage}
                                          onCriteriaChange={this.onFilterChange}/>
                </PageSection>
                <PageSection variant={PageSectionVariants.default} isFilled={true}>
                    <If condition={this.state.isSearching}>
                        <Flex>
                            <FlexItem><Spinner size="lg"/></FlexItem>
                            <FlexItem><span>Searching...</span></FlexItem>
                        </Flex>
                    </If>
                    <If condition={!this.state.isSearching && this.state.results?.artifacts.length === 0}>
                        <ArtifactsPageEmptyState isFiltered={this.isFiltered()}/>
                    </If>
                    <If condition={!this.state.isSearching && this.state.results?.artifacts.length !== 0}>
                        <ArtifactList registry={this.state.selectedRegistry as RegistryInstance} artifacts={this.artifacts()} />
                    </If>
                </PageSection>
            </React.Fragment>
        );
    }

    protected initializePageState(): ArtifactsPageState {
        const criteria: ArtifactsPageToolbarFilterCriteria = {
            ascending: true,
            filterSelection: "name",
            filterValue: ""
        }

        return {
            criteria,
            isPleaseWaitModalOpen: false,
            isSearching: false,
            paging: {
                page: 1,
                pageSize: 10
            },
            registries: null,
            results: null,
            selectedRegistry: null
        };
    }

    // @ts-ignore
    protected createLoaders(): Promise {
        return Services.getRegistriesService().listRegistries().then( registries => {
            if (registries && registries.length > 0) {
                this.setMultiState({
                    isSearching: true,
                    registries,
                    selectedRegistry: registries[0]
                }, () => {
                    this.search();
                });
            }
        });
    }

    // @ts-ignore
    private search(): Promise {
        Services.getLoggerService().debug("[ArtifactsPage] Searching for artifacts now...");
        const gac: GetArtifactsCriteria = {
            sortAscending: this.state.criteria.ascending,
            type: this.state.criteria.filterSelection,
            value: this.state.criteria.filterValue
        };
        return Services.getRegistryService().getArtifacts(this.state.selectedRegistry as RegistryInstance, gac, this.state.paging).then(results => {
            this.onArtifactsLoaded(results);
        }).catch(error => {
            this.handleServerError(error, "Error searching for artifacts.");
        });
    }

    private onArtifactsLoaded(results: ArtifactsSearchResults): void {
        this.setMultiState({
            isSearching: false,
            results
        });
    }

    private results(): ArtifactsSearchResults {
        return this.state.results ? this.state.results : {
            artifacts: [],
            count: 0,
            page: 1,
            pageSize: 10
        };
    }

    private artifacts(): SearchedArtifact[] {
        return this.state.results ? this.state.results.artifacts : [];
    }

    private onSetPage = (event: any, newPage: number, perPage?: number): void => {
        const paging: Paging = {
            page: newPage,
            pageSize: perPage ? perPage : this.state.paging.pageSize
        };
        this.setMultiState({
            isSearching: true,
            paging
        }, () => {
            this.search();
        });
    };

    private onPerPageSelect = (event: any, newPerPage: number): void => {
        const paging: Paging = {
            page: this.state.paging.page,
            pageSize: newPerPage
        };
        this.setMultiState({
            isSearching: true,
            paging
        }, () => {
            this.search();
        });
    };

    private onFilterChange = (criteria: ArtifactsPageToolbarFilterCriteria): void => {
        this.setMultiState({
            criteria,
            isSearching: true
        }, () => {
            this.search();
        });
    };

    private onRegistryChange = (registry: RegistryInstance): void => {
        this.setMultiState({
            isSearching: true,
            selectedRegistry: registry
        }, () => {
            this.search();
        });
    };

    private isFiltered(): boolean {
        return !!this.state.criteria.filterValue;
    }

}
