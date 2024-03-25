import {
    ApicurioStudioClient,
    createApicurioStudioClient
} from "../../src-generated/studio-client/apicurioStudioClient.ts";
import { AnonymousAuthenticationProvider, AuthenticationProvider, RequestAdapter } from "@microsoft/kiota-abstractions";
import { FetchRequestAdapter } from "@microsoft/kiota-http-fetchlibrary";

export class StudioClientFactory {

    public static createStudioClient(baseUrl: string): ApicurioStudioClient {
        const authProvider: AuthenticationProvider = new AnonymousAuthenticationProvider();
        const requestAdapter: RequestAdapter = new FetchRequestAdapter(authProvider);
        requestAdapter.baseUrl = baseUrl;
        return createApicurioStudioClient(requestAdapter);
    }

}