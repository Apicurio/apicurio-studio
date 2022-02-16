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
import {PureComponent, PureComponentProps, PureComponentState} from "../baseComponent";
import {Services} from "../../../services";
import {AuthService} from "../../../services/auth";

/**
 * Properties
 */
export interface IfAuthProps extends PureComponentProps {
    enabled?: boolean;
    isAuthenticated?: boolean;
    children?: React.ReactNode;
}

/**
 * State
 */
// tslint:disable-next-line:no-empty-interface
export interface IfAuthState extends PureComponentState {
}


/**
 * Wrapper around a set of arbitrary child elements and displays them only if the
 * indicated authentication parameters are true.
 */
export class IfAuth extends PureComponent<IfAuthProps, IfAuthState> {

    constructor(props: Readonly<IfAuthProps>) {
        super(props);
    }

    public render(): React.ReactElement {
        if (this.accept()) {
            return <React.Fragment children={this.props.children} />
        } else {
            return <React.Fragment />
        }
    }

    protected initializeState(): IfAuthState {
        return {};
    }

    private accept(): boolean {
        const auth: AuthService = Services.getAuthService();
        let rval: boolean = true;
        if (this.props.enabled !== undefined) {
            rval = rval && (auth.isAuthenticationEnabled() === this.props.enabled);
        }
        if (this.props.isAuthenticated !== undefined) {
            rval = rval && (auth.isAuthenticated() === this.props.isAuthenticated);
        }
        return rval;
    }

}
