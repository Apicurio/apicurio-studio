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

import React from 'react';
import "./header.css"
import {Brand, PageHeader, PageHeaderTools, PageHeaderToolsGroup, PageHeaderToolsItem} from '@patternfly/react-core';
import brandImg from "./apicurio_logo_darkbkg_350px.png";
import {PureComponent, PureComponentProps, PureComponentState} from "../baseComponent";
import {IfAuth} from "../common/ifAuth";
import {AvatarDropdown} from "./avatarDropdown";


// tslint:disable-next-line:no-empty-interface
export interface AppHeaderProps extends PureComponentProps {
}

// tslint:disable-next-line:no-empty-interface
export interface AppHeaderState extends PureComponentState {
}


export class AppHeader extends PureComponent<AppHeaderProps, AppHeaderState> {

    constructor(props: Readonly<AppHeaderProps>) {
        super(props);
    }

    public render(): React.ReactElement {
        let pageToolbar: React.ReactElement;
        pageToolbar = (
            <PageHeaderTools className="header-toolbar">
                <PageHeaderToolsGroup>
                    <PageHeaderToolsItem id="avatar">
                        <IfAuth enabled={true}>
                            <AvatarDropdown />
                        </IfAuth>
                    </PageHeaderToolsItem>
                </PageHeaderToolsGroup>
            </PageHeaderTools>
        );

        return (<PageHeader
            logo={<Brand onClick={this.navigateTo(this.linkTo("/apis"))} src={brandImg} alt="API Studio"/>}
            showNavToggle={false}
            headerTools={pageToolbar}
        />);
    }

    protected initializeState(): AppHeaderState {
        return {};
    }

}
