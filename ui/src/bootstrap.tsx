import React from "react";
import ReactDOM from "react-dom";
import "@patternfly/react-core/dist/styles/base.css";
import App from "./app/app";
import "./app/app.css";
import {Services} from "./services";


const renderApp = () => ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
Services.getAuthService().authenticateAndRender(renderApp);

