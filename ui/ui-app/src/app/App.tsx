import "./App.css";
import "@patternfly/patternfly/patternfly.css";
import "@patternfly/patternfly/patternfly-addons.css";

import React from "react";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { EditorPage, EmbeddedEditorPage, HomePage } from "@app/pages";
import { ApplicationAuth, AuthConfig, AuthConfigContext } from "@apicurio/common-ui-components";
import { ApicurioStudioConfig, useConfigService } from "@services/useConfigService.ts";


export const App: React.FunctionComponent = () => {
    const appConfig: ApicurioStudioConfig = useConfigService().getApicurioStudioConfig();

    const router = createBrowserRouter(
        createRoutesFromElements(
            <>
                <Route path="/" element={<HomePage />}/>,
                <Route path="/designs/:designId/editor" element={<EditorPage />}/>,
                <Route path="/editor-embedded" element={<EmbeddedEditorPage />}/>,
            </>
        ),
        {
            basename: appConfig.ui?.contextPath || "/"
        }
    );

    return (
        <AuthConfigContext.Provider value={appConfig.auth as AuthConfig}>
            <ApplicationAuth>
                <RouterProvider router={router} />
            </ApplicationAuth>
        </AuthConfigContext.Provider>
    );
};
