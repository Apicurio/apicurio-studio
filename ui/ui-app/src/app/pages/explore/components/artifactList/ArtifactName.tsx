import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { AppNavigationService, useAppNavigation } from "@services/useAppNavigation.ts";

let testIdCounter: number = 1;

export type ArtifactNameProps = {
    groupId: string|null;
    id: string;
    name: string;
}


export const ArtifactName: FunctionComponent<ArtifactNameProps> = (props: ArtifactNameProps) => {
    const appNav: AppNavigationService = useAppNavigation();

    const artifactLink = (): string => {
        const groupId: string = props.groupId == null ? "default" : props.groupId;
        const link: string = `/explore/${ encodeURIComponent(groupId)}/${ encodeURIComponent(props.id) }`;
        return appNav.createLink(link);
    };

    const counter = testIdCounter++;
    const testId = (prefix: string): string => {
        return `${prefix}-${counter}`;
    };

    return props.name ? (
        <React.Fragment>
            <Link className="id" data-testid={testId("artifacts-lnk-view-id-")} to={artifactLink()}>{props.id}</Link>
            <Link className="name" data-testid={testId("artifacts-lnk-view-")} to={artifactLink()}>{props.name}</Link>
        </React.Fragment>
    ) : (
        <React.Fragment>
            <Link className="id" data-testid={testId("artifacts-lnk-view-")} to={artifactLink()}>{props.id}</Link>
        </React.Fragment>
    );

};
