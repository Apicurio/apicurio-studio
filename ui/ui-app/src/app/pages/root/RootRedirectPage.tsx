import { FunctionComponent } from "react";
import { Navigate } from "react-router-dom";
import { AppNavigationService, useAppNavigation } from "@services/useAppNavigation.ts";


/**
 * The root redirect page.
 */
export const RootRedirectPage: FunctionComponent<any> = () => {
    const appNav: AppNavigationService = useAppNavigation();

    const redirect: string = appNav.createLink("/drafts");
    return (
        <Navigate to={redirect} replace />
    );

};
