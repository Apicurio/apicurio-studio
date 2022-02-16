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
import "./avatarDropdown.css"
import avatarImg from "./avatar.png";
import {Avatar, Button, Dropdown, DropdownItem, DropdownToggle} from '@patternfly/react-core';
import {PureComponent, PureComponentProps, PureComponentState} from "../baseComponent";
import {Services} from "../../../services";


// tslint:disable-next-line:no-empty-interface
export interface AvatarDropdownProps extends PureComponentProps {
}

// tslint:disable-next-line:no-empty-interface
export interface AvatarDropdownState extends PureComponentState {
    isOpen: boolean;
}


export class AvatarDropdown extends PureComponent<AvatarDropdownProps, AvatarDropdownState> {

    constructor(props: Readonly<AvatarDropdownProps>) {
        super(props);
    }

    public render(): React.ReactElement {
        const dropdownItems = [
            <DropdownItem key="logout">
                <Button className="avatar-logout-link" onClick={() => Services.getAuthService().doLogout()} variant="link" isInline={true}>Logout</Button>
            </DropdownItem>,
        ];

        return (
            <Dropdown
                id="avatar-dropdown"
                onSelect={this.onSelect}
                toggle={
                    <DropdownToggle onToggle={this.onToggle} aria-label="User Menu" id="avatar-toggle">
                        <Avatar src={avatarImg} alt="User" />
                    </DropdownToggle>
                }
                isOpen={this.state.isOpen}
                isPlain={true}
                dropdownItems={dropdownItems}
            />
        );
    }

    protected initializeState(): AvatarDropdownState {
        return {
            isOpen: false
        };
    }

    private onSelect = (event: any): void => {
        this.setSingleState("isOpen", !this.state.isOpen);
        // @ts-ignore
        document.getElementById("avatar-toggle").focus();
    };

    private onToggle = (): void => {
        this.setSingleState("isOpen", !this.state.isOpen);
    };

}
