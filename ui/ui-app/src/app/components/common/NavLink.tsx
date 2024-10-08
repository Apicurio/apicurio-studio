import React, { CSSProperties, FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { AppNavigationService, useAppNavigation } from "@services/useAppNavigation.ts";

export type NavLinkProps = {
    location: string;
    title?: string;
    className?: string;
    style?: CSSProperties;
    testId?: string;
    children?: React.ReactNode;
}

export const NavLink: FunctionComponent<NavLinkProps> = ({ testId, location, title, className, style, children }: NavLinkProps) => {
    const nav: AppNavigationService = useAppNavigation();
    const to: string = nav.createLink(location);

    return (
        <Link data-testid={testId} className={className} style={style} title={title} to={to} children={children as any} />
    );
};
