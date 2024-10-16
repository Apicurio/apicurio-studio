import React, { FunctionComponent } from "react";
import { AppNavigation, useAppNavigation } from "@services/useAppNavigation.ts";
import { Link } from "react-router-dom";

let testIdCounter: number = 1;

/**
 * Properties
 */
export type ArtifactGroupProps = {
    groupId: string|null;
};


/**
 * Models an artifact group in a list of artifacts or groups.
 */
export const ArtifactGroup: FunctionComponent<ArtifactGroupProps> = (props: ArtifactGroupProps) => {
    const appNav: AppNavigation = useAppNavigation();

    const groupLink = (): string => {
        const groupId: string = props.groupId == null ? "default" : props.groupId;
        const link: string = `/explore/${ encodeURIComponent(groupId)}`;
        return appNav.createLink(link);
    };

    const counter = testIdCounter++;
    const testId = (prefix: string): string => {
        return `${prefix}-${counter}`;
    };

    const style = (): string => {
        return !props.groupId ? "nogroup" : "group";
    };

    return (
        <React.Fragment>
            <Link className={style()} data-testid={testId("group-lnk-view")} to={groupLink()}>{props.groupId}</Link>
        </React.Fragment>
    );

};
