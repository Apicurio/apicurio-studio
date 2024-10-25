import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { AppNavigationService, useAppNavigation } from "@services/useAppNavigation.ts";

export type DraftIdProps = {
    groupId: string|null;
    draftId: string;
    version: string;
    name: string;
    testId: string;
}


export const DraftId: FunctionComponent<DraftIdProps> = (props: DraftIdProps) => {
    const appNav: AppNavigationService = useAppNavigation();

    const draftLink = (): string => {
        const groupId: string = props.groupId == null ? "default" : props.groupId;
        const gid: string = encodeURIComponent(groupId);
        const did: string = encodeURIComponent(props.draftId);
        const ver: string = encodeURIComponent(props.version);

        const link: string = `/drafts/${gid}/${did}/${ver}`;
        return appNav.createLink(link);
    };

    return props.name ? (
        <React.Fragment>
            <Link className="id" data-testid={`${props.testId}-id`} to={draftLink()}>{props.draftId}</Link>
            <Link className="name" data-testid={`${props.testId}-name`} to={draftLink()}>{props.name}</Link>
        </React.Fragment>
    ) : (
        <React.Fragment>
            <Link className="id" data-testid={`${props.testId}-id`} to={draftLink()}>{props.draftId}</Link>
        </React.Fragment>
    );

};
