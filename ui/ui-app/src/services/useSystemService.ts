import { AuthService, useAuth } from "@apicurio/common-ui-components";
import { getRegistryClient } from "@utils/rest.utils.ts";
import { ApicurioStudioConfig, useConfigService } from "@services/useConfigService.ts";
import { VendorExtension } from "@models/system";
import { ApicurioRegistryClient } from "@apicurio/apicurio-registry-sdk";
import { SystemInfo } from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";


const getInfo = async (appConfig: ApicurioStudioConfig, auth: AuthService): Promise<SystemInfo> => {
    console.debug("[SystemService] Getting system info.");
    const client: ApicurioRegistryClient = getRegistryClient(appConfig, auth);
    return client.system.info.get().then(v => v!);
};

const getOpenApiVendorExtensions = async (/*appConfig: ApicurioStudioConfig, auth: AuthService*/): Promise<VendorExtension[]> => {
    // TODO cache the vendor extensions?
    console.debug("[SystemService] Getting openapi vendor extensions.");
    // TODO implement this in some way
    return Promise.resolve([]);
};

export interface SystemService {
    getInfo(): Promise<SystemInfo>;
    getOpenApiVendorExtensions(): Promise<VendorExtension[]>;
}


export const useSystemService: () => SystemService = (): SystemService => {
    const appConfig: ApicurioStudioConfig = useConfigService().getApicurioStudioConfig();
    const auth: AuthService = useAuth();

    return {
        getInfo(): Promise<SystemInfo> {
            return getInfo(appConfig, auth);
        },
        getOpenApiVendorExtensions(): Promise<VendorExtension[]> {
            return getOpenApiVendorExtensions(/*appConfig, auth*/);
        }
    };
};
