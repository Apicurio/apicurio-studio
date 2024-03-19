import React, { FunctionComponent, useEffect, useState } from "react";
import { Avatar, Dropdown, DropdownItem, DropdownList, MenuToggle, MenuToggleElement } from "@patternfly/react-core";
import { AuthService, useAuth } from "@apicurio/common-ui-components";


export type AvatarDropdownProps = {
    // No props
};


export const AvatarDropdown: FunctionComponent<AvatarDropdownProps> = () => {
    const [username, setUsername] = useState("User");
    const [isOpen, setIsOpen] = useState(false);
    const auth: AuthService = useAuth();

    const onSelect = (): void => {
        setIsOpen(!isOpen);
    };

    const onToggle = (): void => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (auth.isAuthEnabled()) {
            auth.getUsername()?.then(username => setUsername(username as string));
        }
    }, []);

    return (
        <Dropdown
            isOpen={isOpen}
            onSelect={onSelect}
            onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                    ref={toggleRef}
                    onClick={onToggle}
                    isFullHeight={true}
                    isExpanded={isOpen}
                    icon={ <Avatar src="/avatar.png" alt="User" /> }
                >
                    {
                        username
                    }
                </MenuToggle>
            )}
            shouldFocusToggleOnSelect
        >
            <DropdownList>
                <DropdownItem
                    key="link"
                    // Prevent the default onClick functionality for example purposes
                    onClick={(ev: any) => {
                        auth.logout();
                        ev.preventDefault();
                    }}
                >
                    Logout
                </DropdownItem>
            </DropdownList>
        </Dropdown>
    );

};
