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

/**
 * Properties
 */
export interface IfProps extends PureComponentProps {
    condition: boolean | (() => boolean);
    children?: React.ReactNode;
}

/**
 * State
 */
// tslint:disable-next-line:no-empty-interface
export interface IfState extends PureComponentState {
}


/**
 * Wrapper around a set of arbitrary child elements and displays them only if the
 * indicated condition is true.
 */
export class If extends PureComponent<IfProps, IfState> {

    constructor(props: Readonly<IfProps>) {
        super(props);
    }

    public render(): React.ReactElement {
        if (this.accept()) {
            return <React.Fragment children={this.props.children} />
        } else {
            return <React.Fragment />
        }
    }

    protected initializeState(): IfState {
        return {};
    }

    private accept(): boolean {
        if (typeof this.props.condition === "boolean") {
            return this.props.condition;
        } else {
            return this.props.condition();
        }
    }

}
