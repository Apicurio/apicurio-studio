import React, { FunctionComponent } from "react";
import { useUserService } from "@services/useUserService.ts";

/**
 * Properties
 */
export type IfOwnerProps = {
    owner: string | null | undefined | (() => string);
    children?: React.ReactNode;
};

/**
 * Wrapper around a set of arbitrary child elements and displays them only if the
 * indicated condition is true.
 */
export const IfOwner: FunctionComponent<IfOwnerProps> = ({ owner, children }: IfOwnerProps) => {
    const user = useUserService();
    const currentUser = user.currentUser().username;
    let entityOwner: string;
    if (owner === undefined || owner === null) {
        entityOwner = "";
    } else if (typeof owner === "string") {
        entityOwner = owner as string;
    } else {
        entityOwner = owner();
    }
    const isOwner: boolean = currentUser === entityOwner;

    return (isOwner ? <React.Fragment children={children} /> : <React.Fragment />);
};
