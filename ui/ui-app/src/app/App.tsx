import "./App.css";
import "@patternfly/patternfly/patternfly.css";
import "@patternfly/patternfly/patternfly-addons.css";

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { EditorPage, EmbeddedEditorPage, HomePage } from "@app/pages";
import { AppHeader } from "@app/components";
import { Page } from "@patternfly/react-core";
import { ApplicationAuth, AuthConfigContext, AuthConfig } from "@apicurio/common-ui-components";
import { ApicurioStudioConfig, useConfigService } from "@services/useConfigService.ts";


export const App: React.FunctionComponent = () => {
    const appConfig: ApicurioStudioConfig = useConfigService().getApicurioStudioConfig();

    return (
        <AuthConfigContext.Provider value={appConfig.auth as AuthConfig}>
            <ApplicationAuth>
                <Router basename={appConfig.ui.contextPath}>
                    <Page className="pf-m-redhat-font" isManagedSidebar={false} header={<AppHeader />}>
                        <Routes>
                            <Route path="/" element={<HomePage />}/>
                            <Route path="/designs/:designId/editor" element={<EditorPage />}/>
                            <Route path="/editor-embedded" element={<EmbeddedEditorPage />}/>
                        </Routes>
                    </Page>
                </Router>
            </ApplicationAuth>
        </AuthConfigContext.Provider>
    );
};
