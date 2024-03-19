import { NavigateFunction, useNavigate } from "react-router-dom";
import { ApicurioStudioConfig, useApicurioStudioConfig } from "@services/useApicurioStudioConfig.ts";

export const navigateTo = (path: string, appConfig: ApicurioStudioConfig, navigateFunc: NavigateFunction): void => {
    const to: string = `${appConfig.ui.navPrefixPath}${path}`;
    console.debug("[NavigationService] Navigating to: ", to);
    setTimeout(() => {
        navigateFunc(to);
    }, 50);
};

export type AppNavigationService = {
    navigateTo: (path: string) => void;
    createLink: (path: string) => string;
};

export const useAppNavigation: () => AppNavigationService = (): AppNavigationService => {
    const navigate: NavigateFunction = useNavigate();
    const appConfig: ApicurioStudioConfig = useApicurioStudioConfig();

    return {
        navigateTo: (path: string): void => {
            navigateTo(path, appConfig, navigate);
        },
        createLink: (path: string): string => {
            return `${appConfig.ui.navPrefixPath}${path}`;
        },
    };
};
