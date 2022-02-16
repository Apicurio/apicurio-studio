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
import "./apis.css";
import {PageSection, PageSectionVariants} from '@patternfly/react-core';
import {PageComponent, PageProps, PageState} from "../basePage";
import {RootPageHeader} from "../../components";


/**
 * Properties
 */
// tslint:disable-next-line:no-empty-interface
export interface ApisPageProps extends PageProps {
}

/**
 * State
 */
// tslint:disable-next-line:no-empty-interface
export interface ApisPageState extends PageState {
}

/**
 * The apis page.
 */
export class ApisPage extends PageComponent<ApisPageProps, ApisPageState> {

    constructor(props: Readonly<ApisPageProps>) {
        super(props);
    }

    public renderPage(): React.ReactElement {
        return (
            <React.Fragment>
                <PageSection className="ps_apis-header" variant={PageSectionVariants.light} padding={{ default: "noPadding" }}>
                    <RootPageHeader tabKey={0} />
                </PageSection>
                <PageSection variant={PageSectionVariants.default} isFilled={true}>
                    <h1>Hello World</h1>
                </PageSection>
            </React.Fragment>
        );
    }

    protected initializePageState(): ApisPageState {
        return {
        };
    }

    // @ts-ignore
    protected createLoaders(): Promise {
        return [];
    }

}
