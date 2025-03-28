import { util } from "protobufjs";
import fetch = util.fetch;

export type EditorsType = {
    url: string;
};

export type UiType = {
    contextPath: string;
    navPrefixPath: string;
};

export type LinksType = {
    registry: string;
};

export type MastheadType = {
    show: boolean;
    label: string;
};

export type ComponentsType = {
    masthead: MastheadType;
    editors: EditorsType;
};

export type ApisType = {
    studio: string;
    registry: string;
};

export type AuthType = {
    type: string;
    options?: any;
};

export interface VersionType {
    name: string;
    version: string;
    digest: string;
    builtOn: string;
    url: string;
}

export type ApicurioStudioConfig = {
    apis: ApisType;
    links: LinksType;
    ui: UiType;
    components: ComponentsType;
    auth: AuthType;
    version?: VersionType;
};


export interface FeaturesConfig {
    deleteGroup?: boolean;
    deleteArtifact?: boolean;
    deleteVersion?: boolean;
    draftMutability?: boolean;
}

export interface AuthConfig {
    type: string;
    rbacEnabled: boolean;
    obacEnabled: boolean;
}

export interface OidcJsAuthOptions {
    url: string;
    redirectUri: string;
    clientId: string;
    scope: string;
    logoutUrl?: string;
}

// Used when `type=oidc`
export interface OidcJsAuthConfig extends AuthConfig {
    options: OidcJsAuthOptions;
}

// Used when `type=none`
export type NoneAuthConfig = AuthConfig;

export interface ApicurioRegistryConfig {
    auth?: OidcJsAuthConfig | NoneAuthConfig;
    features?: FeaturesConfig;
}


const DEFAULT_VERSION: VersionType = {
    name: "Apicurio Studio",
    version: "DEV",
    digest: "DEV",
    builtOn: new Date().toString(),
    url: "https://www.apicur.io/studio"
};

function getApicurioStudioVersion(): VersionType {
    let version: VersionType | undefined;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (ApicurioInfo) { version = ApicurioInfo as VersionType; }

    const gw: any = window as any;
    if (gw["ApicurioInfo"]) {
        version = gw["ApicurioInfo"] as VersionType;
    }

    if (!version) {
        version = DEFAULT_VERSION;
    }

    return version;
}


function _getApicurioStudioConfig(): ApicurioStudioConfig {
    let config: ApicurioStudioConfig | undefined;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (ApicurioStudioConfig) { config = ApicurioStudioConfig as ApicurioStudioConfig; }

    const gw: any = window as any;
    if (gw["ApicurioStudioConfig"]) {
        config = gw["ApicurioStudioConfig"] as ApicurioStudioConfig;
    }

    if (config) {
        return config;
    }

    throw new Error("ApicurioStudioConfig not found.");
}

const studioConfig: ApicurioStudioConfig = _getApicurioStudioConfig();
let registryConfig: ApicurioRegistryConfig;

export interface ConfigService {
    fetchAndMergeConfigs(): Promise<void>;
    getApicurioStudioConfig(): ApicurioStudioConfig;
    getApicurioRegistryConfig(): ApicurioRegistryConfig;
}


export class ConfigServiceImpl implements ConfigService {

    public fetchAndMergeConfigs(): Promise<void> {
        studioConfig.version = getApicurioStudioVersion();

        // Default auth is: "none"
        if (!studioConfig.auth) {
            studioConfig.auth = {
                type: "none"
            };
        }

        console.info("[ConfigService] Loaded Studio UI config: ", studioConfig);

        const registryApi: string = studioConfig.apis.registry;
        const registryConfigEndpoint: string = `${registryApi}/system/uiConfig`;

        // Fetching Registry UI config
        console.info("[ConfigService] Loading Registry UI config: ", registryConfigEndpoint);
        return fetch(registryConfigEndpoint).then(response => {
            console.info("[ConfigService] Loaded Registry UI config: ", response);
            registryConfig = JSON.parse(response as string);
        }).catch(() => {
            registryConfig = {
                auth: {
                    type: "none",
                    obacEnabled: false,
                    rbacEnabled: false,
                },
                features: {
                    deleteVersion: false,
                    deleteArtifact: false,
                    deleteGroup: false,
                    draftMutability: false
                },
            };
        });
    }

    public getApicurioStudioConfig(): ApicurioStudioConfig {
        return studioConfig;
    }

    public getApicurioRegistryConfig(): ApicurioRegistryConfig {
        return registryConfig;
    }

}

const configService: ConfigService = new ConfigServiceImpl();

/**
 * React hook to get the app config.
 */
export const useConfigService: () => ConfigService = (): ConfigService => {
    return configService;
};
