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

import React from "react";
import {Tab, Tabs, TabTitleText} from '@patternfly/react-core';
import "./pageheader.css";
import {PureComponent, PureComponentProps, PureComponentState} from "../baseComponent";
import {IfAuth} from "../common";
import {Services} from "../../../services";


/**
 * Properties
 */
// tslint:disable-next-line:no-empty-interface
export interface RootPageHeaderProps extends PureComponentProps {
    tabKey: number;
}

/**
 * State
 */
// tslint:disable-next-line:no-empty-interface
export interface RootPageHeaderState extends PureComponentState {
}


/**
 * Models the page header for the Artifacts page.
 */
export class RootPageHeader extends PureComponent<RootPageHeaderProps, RootPageHeaderState> {

    constructor(props: Readonly<RootPageHeaderProps>) {
        super(props);
    }

    public render(): React.ReactElement {
        const tabs: any[] = [
            <Tab key={0} eventKey={0} title={<TabTitleText>Apis</TabTitleText>} />,
            <Tab key={1} eventKey={1} title={<TabTitleText>Teams</TabTitleText>} />
        ];
        return (
            <div>
                <Tabs activeKey={this.props.tabKey} onSelect={this.handleTabClick} children={tabs} />
            </div>
        );
    }

    protected initializeState(): RootPageHeaderState {
        return {};
    }

    private handleTabClick = (event: React.MouseEvent<HTMLElement, MouseEvent>, eventKey: number | string): void => {
        if (eventKey !== this.props.tabKey) {
            if (eventKey === 0) {
                // navigate to artifacts
                this.navigateTo(this.linkTo("/apis"))();
            }
            if (eventKey === 1) {
                // navigate to global rules
                this.navigateTo(this.linkTo("/teams"))();
            }
        }
    }
}
