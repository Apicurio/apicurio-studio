import { AuthService, useAuth } from "@apicurio/common-ui-components";
import { SystemInfo } from "@models/system/SystemInfo.ts";
import { createEndpoint, createOptions, httpGet } from "@utils/rest.utils.ts";
import { ApicurioStudioConfig, useConfigService } from "@services/useConfigService.ts";


const getInfo = async (appConfig: ApicurioStudioConfig, auth: AuthService, ): Promise<SystemInfo> => {
    console.debug("[SystemService] Getting system info.");
    const token: string | undefined = await auth.getToken();

    const endpoint: string = createEndpoint(appConfig.apis.studio, "/system/info");
    const headers: any = {
        "Authorization": `Bearer ${token}`
    };
    return httpGet<SystemInfo>(endpoint, createOptions(headers));
};

export interface SystemService {
    getInfo(): Promise<SystemInfo>;
}


export const useSystemService: () => SystemService = (): SystemService => {
    const appConfig: ApicurioStudioConfig = useConfigService().getApicurioStudioConfig();
    const auth: AuthService = useAuth();

    return {
        getInfo(): Promise<SystemInfo> {
            return getInfo(appConfig, auth);
        }
    };
};
