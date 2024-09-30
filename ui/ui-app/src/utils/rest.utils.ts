import { AuthenticationProvider, Headers, RequestInformation } from "@microsoft/kiota-abstractions";
import { AuthService } from "@apicurio/common-ui-components";
import { ApicurioRegistryClient, RegistryClientFactory } from "@apicurio/apicurio-registry-sdk";
import { ApicurioStudioConfig } from "@services/useConfigService.ts";

/**
 * An authentication provider for Kiota - used in the generated SDK client to provide
 * auth information when making REST calls to the Registry backend.
 */
export class TokenAuthenticationProvider implements AuthenticationProvider {
    private readonly key: string;
    private readonly accessTokenProvider: () => Promise<string>;
    private static readonly authorizationHeaderKey = "Authorization";
    public constructor(key: string, accessTokenProvider: () => Promise<string>) {
        this.key = key;
        this.accessTokenProvider = accessTokenProvider;
    }

    public authenticateRequest = async (request: RequestInformation, additionalAuthenticationContext?: Record<string, unknown>): Promise<void> => {
        if (!request) {
            throw new Error("request info cannot be null");
        }
        if (additionalAuthenticationContext?.claims && request.headers.has(TokenAuthenticationProvider.authorizationHeaderKey)) {
            request.headers.delete(TokenAuthenticationProvider.authorizationHeaderKey);
        }
        if (!request.headers || !request.headers.has(TokenAuthenticationProvider.authorizationHeaderKey)) {
            const token = await this.accessTokenProvider();
            if (!request.headers) {
                request.headers = new Headers();
            }
            if (token) {
                request.headers.add(TokenAuthenticationProvider.authorizationHeaderKey, `${this.key} ${token}`);
            }
        }
    };
}


export function createAuthProvider(auth: AuthService): AuthenticationProvider | undefined {
    if (auth.isOidcAuthEnabled()) {
        return new TokenAuthenticationProvider("Bearer", () => auth.getToken().then(v => v!));
    } else if (auth.isBasicAuthEnabled()) {
        const userPass = auth.getUsernameAndPassword();
        const credentials = `${userPass?.username}:${userPass?.password}`;
        const base64Credentials = btoa(credentials);
        return new TokenAuthenticationProvider("Basic", async () => base64Credentials);
    }
    return undefined;
}

function createRegistryClient(config: ApicurioStudioConfig, auth: AuthService): ApicurioRegistryClient {
    const authProvider = createAuthProvider(auth);
    return RegistryClientFactory.createRegistryClient(config.apis.registry, authProvider);
}

let client: ApicurioRegistryClient;

export const getRegistryClient = (config: ApicurioStudioConfig, auth: AuthService): ApicurioRegistryClient => {
    if (client === undefined) {
        client = createRegistryClient(config, auth);
    }
    return client;
};

//
// function unwrapErrorData(error: any): any {
//     console.debug("Error detected, unwrapping...");
//     if (error && error.response && error.response.data) {
//         return {
//             message: error.message,
//             ...error.response.data,
//             status: error.response.status
//         };
//     } else if (error && error.response) {
//         return {
//             message: error.message,
//             status: error.response.status
//         };
//     } else if (error) {
//         console.error("Unknown error detected: ", error);
//         return {
//             message: error.message,
//             status: 500
//         };
//     } else {
//         console.error("Unknown error detected: ", error);
//         return {
//             message: "Unknown error",
//             status: 500
//         };
//     }
// }
