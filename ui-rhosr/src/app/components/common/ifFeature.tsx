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

/**
 * Properties
 */
export interface IfFeatureProps extends PureComponentProps {
    feature: string;
    is?: any;
    isNot?: any;
    children?: React.ReactNode;
}

/**
 * State
 */
// tslint:disable-next-line:no-empty-interface
export interface IfFeatureState extends PureComponentState {
}


/**
 * Wrapper around a set of arbitrary child elements and displays them only if the
 * indicated feature matches the given criteria.  Use this if you want to show/hide
 * UI elements based on the configured application feature set.
 */
export class IfFeature extends PureComponent<IfFeatureProps, IfFeatureState> {

    constructor(props: Readonly<IfFeatureProps>) {
        super(props);
    }

    public render(): React.ReactElement {
        if (this.accept()) {
            return <React.Fragment children={this.props.children} />
        } else {
            return <React.Fragment />
        }
    }

    protected initializeState(): IfFeatureState {
        return {};
    }

    private accept(): boolean {
        const features: any = Services.getConfigService().features();
        const featureValue: any = features[this.props.feature];
        if (this.props.is !== undefined) {
            return featureValue === this.props.is;
        } else if (this.props.isNot !== undefined) {
            return featureValue !== this.props.isNot;
        } else {
            return featureValue !== undefined;
        }
    }

}
