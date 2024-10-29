import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "@app/App.tsx";
import { ConfigService, useConfigService } from "@services/useConfigService.ts";

// eslint-disable-next-line react-hooks/rules-of-hooks
const config: ConfigService = useConfigService();

config.fetchAndMergeConfigs().then(() => {
    ReactDOM.createRoot(document.getElementById("root")!).render(
        <React.Fragment>
            <App/>
        </React.Fragment>,
    );
}).catch(error => {
    console.warn("Error loading config from Registry: ", error);
    ReactDOM.createRoot(document.getElementById("root")!).render(
        <React.Fragment>
            <App/>
        </React.Fragment>,
    );
});
