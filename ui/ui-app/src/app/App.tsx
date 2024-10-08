import "./App.css";
import "@patternfly/patternfly/patternfly.css";
import "@patternfly/patternfly/patternfly-addons.css";

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { DraftsPage, EditorPage, EmbeddedEditorPage, RootRedirectPage } from "@app/pages";
import { ApplicationAuth, AuthConfig, AuthConfigContext } from "@apicurio/common-ui-components";
import { ApicurioStudioConfig, useConfigService } from "@services/useConfigService.ts";
import { Page } from "@patternfly/react-core";
import { AppHeader } from "@app/components";
import { NotFoundPage } from "@app/pages/404";


export const App: React.FunctionComponent = () => {
    const appConfig: ApicurioStudioConfig = useConfigService().getApicurioStudioConfig();

    const contextPath: string = appConfig.ui?.contextPath || "/";

    return (
        <AuthConfigContext.Provider value={appConfig.auth as AuthConfig}>
            <ApplicationAuth>
                <Router basename={contextPath}>
                    <Page
                        className="pf-m-redhat-font"
                        isManagedSidebar={false}
                        header={<AppHeader />}
                    >
                        <Routes>
                            <Route path="/" element={ <RootRedirectPage /> } />
                            <Route path="/drafts" element={<DraftsPage />}/>,
                            {/*<Route path="/explore" element={ <ExplorePage /> } />*/}
                            <Route path="/designs/:designId/editor" element={<EditorPage />}/>,
                            <Route path="/editor-embedded" element={<EmbeddedEditorPage />}/>,

                            <Route element={ <NotFoundPage /> } />
                        </Routes>
                    </Page>
                </Router>
            </ApplicationAuth>
        </AuthConfigContext.Provider>
    );
};
