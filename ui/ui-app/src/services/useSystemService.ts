import { AuthService, useAuth } from "@apicurio/common-ui-components";
import { SystemInfo } from "@models/system/SystemInfo.ts";
import { createEndpoint, createOptions, httpGet } from "@utils/rest.utils.ts";
import { ApicurioStudioConfig, useConfigService } from "@services/useConfigService.ts";
import { VendorExtension } from "@models/system";


const getInfo = async (appConfig: ApicurioStudioConfig, auth: AuthService): Promise<SystemInfo> => {
    console.debug("[SystemService] Getting system info.");
    const token: string | undefined = await auth.getToken();

    const endpoint: string = createEndpoint(appConfig.apis.studio, "/system/info");
    const headers: any = {
        "Authorization": `Bearer ${token}`
    };
    return httpGet<SystemInfo>(endpoint, createOptions(headers));
};

const getOpenApiVendorExtensions = async (appConfig: ApicurioStudioConfig, auth: AuthService): Promise<VendorExtension[]> => {
    // TODO cache the vendor extensions?
    console.debug("[SystemService] Getting openapi vendor extensions.");
    const token: string | undefined = await auth.getToken();

    const endpoint: string = createEndpoint(appConfig.apis.studio, "/system/uiConfig/openapi/vendorExtensions");
    const headers: any = {
        "Authorization": `Bearer ${token}`
    };
    return httpGet<VendorExtension[]>(endpoint, createOptions(headers));
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
            return getOpenApiVendorExtensions(appConfig, auth);
        }
    };
};
