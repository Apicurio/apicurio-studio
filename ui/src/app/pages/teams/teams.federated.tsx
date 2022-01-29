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

import {TeamsPage, TeamsPageProps} from "./teams";
import {FederatedComponentProps, FederatedUtils} from "../../federated";

export interface FederatedTeamsPageProps extends TeamsPageProps, FederatedComponentProps {
}

export default class FederatedTeamsPage extends TeamsPage {

    constructor(props: Readonly<FederatedTeamsPageProps>) {
        super(props);
    }

    protected postConstruct(): void {
        FederatedUtils.updateConfiguration(this.props as FederatedComponentProps);
        super.postConstruct();
    }

}
