import { FunctionComponent } from "react";
import { Brand, Masthead, MastheadBrand, MastheadContent, MastheadMain } from "@patternfly/react-core";
import { Link } from "react-router-dom";
import { AppHeaderToolbar } from "@app/components";
import { AppNavigationService, useAppNavigation } from "@services/useAppNavigation.ts";
import { ApicurioStudioConfig, useConfigService } from "@services/useConfigService.ts";


export type AppHeaderProps = object;


export const AppHeader: FunctionComponent<AppHeaderProps> = () => {
    const appNav: AppNavigationService = useAppNavigation();
    const config: ApicurioStudioConfig = useConfigService().getApicurioStudioConfig();

    if (config?.components.masthead.show === false) {
        return (<></>);
    }

    return (
        <Masthead id="icon-router-link">
            <MastheadMain>
                <MastheadBrand component={props => <Link {...props} to={ appNav.createLink("/") } />}>
                    <Brand src="/apicurio_studio_logo_reverse.svg" alt="Apicurio Studio" heights={{ default: "36px" }} />
                </MastheadBrand>
            </MastheadMain>
            <MastheadContent>
                <AppHeaderToolbar />
            </MastheadContent>
        </Masthead>
    );
};
