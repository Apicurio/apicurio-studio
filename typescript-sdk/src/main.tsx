import React from "react";
import ReactDOM from "react-dom/client";
import { StudioClientFactory } from "../lib/sdk/factory.ts";

const client = StudioClientFactory.createStudioClient("http://localhost:8080/apis/studio/v1/");
await client.system.info.get().then(info => {
    console.info("SYSTEM INFO: ", info);
}).catch(error => {
    console.error("Failed to connect to Studio: ", error);
});

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <h2>Demo</h2>
    </React.StrictMode>,
);