import { cloneObject } from "@utils/object.utils.ts";
import { createEndpoint, httpGet } from "@utils/rest.utils.ts";

export type EditorsType = {
    url: string;
};

export type UiType = {
    contextPath: string;
    navPrefixPath: string;
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
    ui: UiType;
    components: ComponentsType;
    auth: AuthType;
    version?: VersionType;
};


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


export function getApicurioStudioConfig(): ApicurioStudioConfig {
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


function difference(base: any, overrides: any | undefined): any {
    if (base === undefined) {
        return overrides;
    }
    const rval: any = cloneObject(overrides);

    // Remove any properties that exist in base.
    Object.getOwnPropertyNames(base).forEach(propertyName => {
        if (typeof rval[propertyName] !== "object") {
            delete rval[propertyName];
        }
    });

    // Now diff any remaining props that are objects
    Object.getOwnPropertyNames(rval).forEach(propertyName => {
        const value: any = rval[propertyName];
        const baseValue: any = base[propertyName];
        if (typeof value === "object") {
            rval[propertyName] = difference(baseValue, value);
        }
    });

    // Now remove any properties with empty object values.
    Object.getOwnPropertyNames(rval).forEach(propertyName => {
        if (typeof rval[propertyName] === "object" && Object.keys(rval[propertyName]).length === 0) {
            delete rval[propertyName];
        }
    });

    return rval;
}


function overrideObject(base: any, overrides: any | undefined): any {
    if (overrides === undefined) {
        return {
            ...base
        };
    }
    const rval: any = {};
    Object.getOwnPropertyNames(base).forEach(propertyName => {
        const baseValue: any = base[propertyName];
        const overrideValue: any = overrides[propertyName];
        if (overrideValue) {
            if (typeof baseValue === "object" && typeof overrideValue === "object") {
                rval[propertyName] = overrideObject(baseValue, overrideValue);
            } else {
                rval[propertyName] = overrideValue;
            }
        } else {
            rval[propertyName] = baseValue;
        }
    });
    return rval;
}

function overrideConfig(base: ApicurioStudioConfig, overrides: ApicurioStudioConfig): ApicurioStudioConfig {
    return overrideObject(base, overrides);
}

let studioConfig: ApicurioStudioConfig = getApicurioStudioConfig();


export interface ConfigService {
    fetchAndMergeConfigs(): Promise<void>;
    getApicurioStudioConfig(): ApicurioStudioConfig;
}


export class ConfigServiceImpl implements ConfigService {

    public fetchAndMergeConfigs(): Promise<void> {
        const endpoint: string = createEndpoint(studioConfig.apis.studio, "/system/uiConfig");
        const localConfig: ApicurioStudioConfig = studioConfig;

        console.info("[Config] Fetching UI configuration from: ", endpoint);
        return httpGet<ApicurioStudioConfig>(endpoint).then(remoteConfig => {
            console.info("[Config] UI configuration fetched successfully: ", remoteConfig);
            // Always use the local config's "apis.studio" property (contains the REST API endpoint)
            if (remoteConfig.apis === undefined) {
                remoteConfig.apis = localConfig.apis;
            } else {
                remoteConfig.apis.studio = localConfig.apis.studio;
            }
            // Override the remote config with anything in the local config.  Then set the result
            // as the new official app config.
            studioConfig = overrideConfig(remoteConfig, localConfig);

            // Make sure the EditorsUrl is absolute and based on the current window location.
            const editorsUrl: string = studioConfig.components.editors.url.startsWith("/") ?
                (window.location.origin + studioConfig.components.editors.url) :
                studioConfig.components.editors.url;
            studioConfig.components.editors.url = editorsUrl;

            // Check for extra/unknown local config and warn about it.
            const diff: any = difference(remoteConfig, localConfig);
            if (Object.keys(diff).length > 0) {
                console.warn("[Config] Local config contains unexpected properties: ", diff);
            }

            // Add the version to the config.
            studioConfig.version = getApicurioStudioVersion();

            console.debug("Full app UI config: ", studioConfig);
        }).catch(error => {
            console.error("[Config] Error fetching UI configuration: ", error);
            console.error("------------------------------------------");
            console.error("[Config] Note: using local UI config only!");
            console.error("------------------------------------------");
            return Promise.resolve();
        });
    }

    public getApicurioStudioConfig(): ApicurioStudioConfig {
        return studioConfig;
    }

}

const configService: ConfigService = new ConfigServiceImpl();

/**
 * React hook to get the app config.
 */
export const useConfigService: () => ConfigService = (): ConfigService => {
    return configService;
};
