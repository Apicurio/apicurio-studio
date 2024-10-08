import { AuthService, useAuth } from "@apicurio/common-ui-components";
import { getRegistryClient } from "@utils/rest.utils.ts";
import { ApicurioStudioConfig, ConfigService, useConfigService } from "@services/useConfigService.ts";
import { UserInfo } from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";

let currentUserInfo: UserInfo = {
    username: "",
    displayName: "",
    admin: false,
    developer: false,
    viewer: false
};


const currentUser = (): UserInfo => {
    return currentUserInfo;
};

const updateCurrentUser = async (config: ApicurioStudioConfig, auth: AuthService): Promise<UserInfo> => {
    const isAuthenticated: boolean = await auth.isAuthenticated();
    if (isAuthenticated) {
        return getRegistryClient(config, auth).users.me.get().then(userInfo => {
            currentUserInfo = userInfo!;
            return userInfo!;
        });
    } else {
        return Promise.resolve(currentUserInfo);
    }
};


export interface UserService {
    currentUser(): UserInfo;
    updateCurrentUser(): Promise<UserInfo>;
}


export const useUserService: () => UserService = (): UserService => {
    const auth: AuthService = useAuth();
    const config: ConfigService = useConfigService();

    return {
        currentUser,
        updateCurrentUser(): Promise<UserInfo> {
            return updateCurrentUser(config.getApicurioStudioConfig(), auth);
        },
    };
};
