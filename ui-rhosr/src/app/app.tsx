/**
 * @license
 * Copyright 2021 Red Hat
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from "react";
import {Page} from "@patternfly/react-core";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {AppHeader} from "./components/header";
import {ApisPage} from "./pages/apis";
import {RootRedirectPage} from "./pages/root";
import {NotFoundPage} from "./pages/404";
import {Services} from "../services";
import {TeamsPage} from "./pages/teams";


/**
 * The main application class.
 */
export default class App extends React.PureComponent<{}, {}> {

    constructor(props: Readonly<any>) {
        super(props);
    }

    public render() {
        const contextPath: string|undefined = Services.getConfigService().uiContextPath();
        Services.getLoggerService().info("[App] Using app contextPath: ", contextPath);

        return (
            <Router basename={contextPath}>
                <Page
                    className="pf-m-redhat-font"
                    isManagedSidebar={false}
                    header={<AppHeader/>}
                >
                    <Switch>
                        <Route path='/' exact={true} component={RootRedirectPage}/>
                        <Route path='/teams' exact={true} component={TeamsPage}/>
                        <Route path='/apis' exact={true} component={ApisPage}/>
                        <Route component={NotFoundPage} />
                    </Switch>
                </Page>
            </Router>
        );
    }
}
