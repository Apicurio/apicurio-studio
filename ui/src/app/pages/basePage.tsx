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

import React from "react";
import {ErrorPage, PageError, PureComponent, PureComponentProps, PureComponentState} from "../components";
import {Services} from "../../services";
import {Flex, FlexItem, PageSection, PageSectionVariants, Spinner} from "@patternfly/react-core";
import {AccessErrorPage} from "../components/errorPage/accessErrorPage";

// TODO this should be configurable via standard UI config settings
const MAX_RETRIES: number = 5;

export enum PageErrorType {
    React, Server
}

/**
 * Properties
 */
// tslint:disable-next-line:no-empty-interface
export interface PageProps extends PureComponentProps {
}

/**
 * State
 */
// tslint:disable-next-line:no-empty-interface
export interface PageState extends PureComponentState {
    pageLoadRetries?: number;
    isLoading?: boolean;
    isError?: boolean;
    error?: PageError;
}


/**
 * The artifacts page.
 */
export abstract class PageComponent<P extends PageProps, S extends PageState> extends PureComponent<P, S> {

    protected constructor(props: Readonly<P>) {
        super(props);
        setTimeout(() => {
            this.loadPageData();
        }, 10);
    }

    public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        this.handleError(PageErrorType.React, error, errorInfo);
    }

    public render(): React.ReactElement {
        if (this.isError()) {
            if (this.is403Error()) {
                return (
                    <AccessErrorPage error={this.state.error} />
                );
            } else {
                return (
                    <ErrorPage error={this.state.error}/>
                );
            }
        } else if (this.isLoading()) {
            return (
                <React.Fragment>
                    <PageSection variant={PageSectionVariants.default} isFilled={true}>
                        <Flex>
                            <FlexItem><Spinner size="lg"/></FlexItem>
                            <FlexItem><span>Loading...</span></FlexItem>
                        </Flex>
                    </PageSection>
                </React.Fragment>
            );
        } else {
            return this.renderPage();
        }
    }

    protected initializeState(): S {
        return {
            ...this.initializePageState(),
            isLoading: true
        };
    }

    protected abstract initializePageState(): S;

    /**
     * Renders the page content.  Subclasses should implement this instead of render() so that
     * errors are handled/displayed properly.
     */
    protected abstract renderPage(): React.ReactElement;

    protected postConstruct(): void {
        // @ts-ignore
        PureComponent.setHistory(this.props.history);
        super.postConstruct();
    }

    // @ts-ignore
    protected createLoaders(): Promise | Promise[] | null {
        return null;
    }

    protected handleServerError(error: any, errorMessage: string): void {
        this.handleError(PageErrorType.Server, error, errorMessage);
    }

    protected getPathParam(paramName: string): string {
        // @ts-ignore
        return decodeURIComponent(this.props.match.params[paramName]);
    }

    protected isLoading(): boolean {
        return this.state.isLoading ? true : false;
    }

    private loadPageData(): void {
        // @ts-ignore
        let loaders: Promise | Promise[] | null = this.createLoaders();

        // If not loading anything, convert from null to empty array
        if (loaders == null) {
            loaders = [];
        }

        // Convert to array if not already
        if (!Array.isArray(loaders)) {
            loaders = [ loaders ];
        }

        // Always add the "update current user" loader
        loaders = [
            Services.getUsersService().updateCurrentUser(),
            ...loaders
        ];

        if (loaders.length === 0) {
            this.setSingleState("isLoading", false);
        } else {
            this.setSingleState("isLoading", true);
            Promise.all(loaders).then(() => {
                this.setSingleState("isLoading", false);
            }).catch(error => {
                Services.getLoggerService().debug("[PageComponent] Page data load failed, retrying.");
                const retries: number = this.getRetries();
                if (retries < MAX_RETRIES) {
                    this.incrementRetries();
                    setTimeout(() => {
                        this.loadPageData();
                    }, Math.pow(2, retries) * 100);
                } else {
                    this.handleServerError(error, "Error loading page data.");
                }
            });
        }
    }

    private getRetries(): number {
        return this.state.pageLoadRetries !== undefined ? this.state.pageLoadRetries as number : 0;
    }

    private incrementRetries(): void {
        const retries: number = this.getRetries() + 1;
        this.setSingleState("pageLoadRetries", retries);
    }

    private isError(): boolean {
        return this.state.isError ? true : false;
    }

    private is403Error(): boolean {
        return this.state.error && this.state.error.error.status && (this.state.error.error.status === 403);
    }

    private handleError(errorType: PageErrorType, error: any, errorMessage: any): void {
        Services.getLoggerService().error("[PageComponent] Handling an error of type: ", errorType);
        Services.getLoggerService().error("[PageComponent] ", errorMessage);
        Services.getLoggerService().error("[PageComponent] ", error);
        this.setMultiState({
            error: {
                error,
                errorMessage,
                type: errorType
            },
            isError: true
        });
    }
}
