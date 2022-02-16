/**
 * @license
 * Copyright 2021 JBoss Inc
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

import React from 'react';
import "./errorPage.css";
import {
    Button,
    EmptyState,
    EmptyStateBody,
    EmptyStateIcon,
    EmptyStateSecondaryActions,
    EmptyStateVariant,
    PageSection,
    PageSectionVariants,
    Title
} from '@patternfly/react-core';
import {LockedIcon} from "@patternfly/react-icons";
import {ErrorPage, ErrorPageProps} from "./errorPage";


export class AccessErrorPage extends ErrorPage {

    constructor(props: Readonly<ErrorPageProps>) {
        super(props);
    }

    public render(): React.ReactElement {
        return (
            <React.Fragment>
                <PageSection className="ps_error" variant={PageSectionVariants.light}>
                    <div className="centerizer">
                        <EmptyState variant={EmptyStateVariant.large}>
                            <EmptyStateIcon icon={LockedIcon} />
                            <Title headingLevel="h5" size="lg">Access Denied</Title>
                            <EmptyStateBody>
                                You are not authorized to access this registry instance.  Please request access
                                from your administrator and then try again.
                            </EmptyStateBody>
                            <EmptyStateSecondaryActions>
                                <Button variant="link"
                                        data-testid="error-btn-artifacts"
                                        onClick={this.navigateBack}>Go Back</Button>
                            </EmptyStateSecondaryActions>
                        </EmptyState>
                    </div>
                </PageSection>
            </React.Fragment>
        );
    }

    protected navigateBack = (): void => {
        window.history.back();
    };

}
