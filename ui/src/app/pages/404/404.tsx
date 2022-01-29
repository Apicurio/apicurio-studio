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
import {PageComponent, PageProps, PageState} from "../basePage";
import {
    Button,
    EmptyState,
    EmptyStateBody,
    EmptyStateIcon,
    EmptyStateVariant,
    PageSection,
    PageSectionVariants,
    Title
} from "@patternfly/react-core";
import {ExclamationCircleIcon} from "@patternfly/react-icons";


/**
 * Properties
 */
// tslint:disable-next-line:no-empty-interface
export interface NotFoundPageProps extends PageProps {

}

/**
 * State
 */
// tslint:disable-next-line:no-empty-interface
export interface NotFoundPageState extends PageState {
}

/**
 * The global rules page.
 */
export class NotFoundPage extends PageComponent<NotFoundPageProps, NotFoundPageState> {

    constructor(props: Readonly<NotFoundPageProps>) {
        super(props);
    }

    public renderPage(): React.ReactElement {
        return (
            <React.Fragment>
                <PageSection className="ps_rules-header" variant={PageSectionVariants.light}>
                    <EmptyState variant={EmptyStateVariant.full}>
                        <EmptyStateIcon icon={ExclamationCircleIcon} />
                        <Title headingLevel="h5" size="lg">
                            404 Error: page not found
                        </Title>
                        <EmptyStateBody>
                            This page couldn't be found.  If you think this is a bug, please report the issue.
                        </EmptyStateBody>
                        <Button variant="primary"
                                data-testid="error-btn-artifacts"
                                onClick={this.navigateTo(this.linkTo("/artifacts"))}>Show all artifacts</Button>
                    </EmptyState>
                </PageSection>
            </React.Fragment>
        );
    }

    protected initializePageState(): NotFoundPageState {
        return {};
    }

}
