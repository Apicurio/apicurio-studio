import "./App.css";
import "@patternfly/patternfly/patternfly.css";
import "@patternfly/patternfly/patternfly-addons.css";

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
    DraftPage,
    DraftsPage,
    GroupPage,
    EditorPage,
    RootRedirectPage,
    ExplorePage,
    ArtifactPage
} from "@app/pages";
import { ApplicationAuth, AuthConfig, AuthConfigContext } from "@apicurio/common-ui-components";
import { ApicurioStudioConfig, useConfigService } from "@services/useConfigService.ts";
import { Banner, Page, PageSection, PageSectionVariants } from "@patternfly/react-core";
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
                        <PageSection className="ps_explore-header" variant={PageSectionVariants.light} padding={{ default: "noPadding" }}>
                            <Banner variant="blue">
                                <b>Note:</b>
                                <span> </span>
                                <span>This version of Apicurio Studio is beta/experimental. Expect bugs until the codebase can stabilize!</span>
                            </Banner>
                        </PageSection>
                        <Routes>
                            <Route
                                path="/"
                                element={ <RootRedirectPage /> } />

                            <Route
                                path="/drafts"
                                element={<DraftsPage />}/>,
                            <Route
                                path="/drafts/:groupId/:draftId/:version"
                                element={ <DraftPage /> } />
                            <Route
                                path="/drafts/:groupId/:draftId/:version/editor"
                                element={ <EditorPage /> } />

                            <Route
                                path="/explore"
                                element={ <ExplorePage />}/>,
                            <Route
                                path="/explore/:groupId"
                                element={ <GroupPage /> } />
                            <Route
                                path="/explore/:groupId/artifacts"
                                element={ <GroupPage /> } />

                            <Route
                                path="/explore/:groupId/:artifactId"
                                element={ <ArtifactPage /> } />
                            <Route
                                path="/explore/:groupId/:artifactId/versions"
                                element={ <ArtifactPage /> } />
                            <Route
                                path="/explore/:groupId/:artifactId/branches"
                                element={ <ArtifactPage /> } />

                            <Route element={ <NotFoundPage /> } />
                        </Routes>
                    </Page>
                </Router>
            </ApplicationAuth>
        </AuthConfigContext.Provider>
    );
};
