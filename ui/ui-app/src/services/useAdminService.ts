import { AuthService, useAuth } from "@apicurio/common-ui-components";
import { ConfigService, useConfigService } from "@services/useConfigService.ts";
import {  getRegistryClient, httpPost } from "@utils/rest.utils.ts";
import { Paging } from "@models/paging.model.ts";
import {
    ArtifactTypeInfo, ConfigurationProperty,
    CreateRule, DownloadRef,
    RoleMapping,
    RoleMappingSearchResults,
    RoleType,
    Rule,
    RuleType, UpdateConfigurationProperty,
    type UpdateRole
} from "@sdk/lib/generated-client/models";


const getArtifactTypes = async (config: ConfigService, auth: AuthService): Promise<ArtifactTypeInfo[]> => {
    console.info("[AdminService] Getting the global list of artifactTypes.");
    return await getRegistryClient(config, auth).admin.config.artifactTypes.get().then(v => v!);
};

const getRules = async (config: ConfigService, auth: AuthService): Promise<Rule[]> => {
    console.info("[AdminService] Getting the global list of rules.");
    const ruleTypes = (await getRegistryClient(config, auth).admin.rules.get()) as RuleType[];
    return Promise.all(
        ruleTypes.map(rt => getRule(config, auth, rt))
    );
};

const getRule = async (config: ConfigService, auth: AuthService, type: string): Promise<Rule> => {
    return await getRegistryClient(config, auth).admin.rules.byRuleType(type).get() as Promise<Rule>;
};

const getRoleMappings = async (config: ConfigService, auth: AuthService, paging: Paging): Promise<RoleMappingSearchResults> => {
    console.info("[AdminService] Getting the list of role mappings.");
    const start: number = (paging.page - 1) * paging.pageSize;
    const end: number = start + paging.pageSize;
    return getRegistryClient(config, auth).admin.roleMappings.get({
        queryParameters: {
            limit: end,
            offset: start
        }
    }).then(v => v!);
};

const getRoleMapping = async (config: ConfigService, auth: AuthService, principalId: string): Promise<RoleMapping> => {
    return getRegistryClient(config.getApicurioStudioConfig(), auth).admin.roleMappings.byPrincipalId(principalId).get().then(v => v!);
};

const listConfigurationProperties = async (config: ConfigService, auth: AuthService): Promise<ConfigurationProperty[]> => {
    console.info("[AdminService] Getting the dynamic config properties.");
    return getRegistryClient(config, auth).admin.config.properties.get().then(v => v!);
};


export interface AdminService {
    getArtifactTypes(): Promise<ArtifactTypeInfo[]>;
    getRules(): Promise<Rule[]>;
    getRule(ruleType: string): Promise<Rule>;
    createRule(ruleType: string, config: string): Promise<Rule>;
    updateRule(ruleType: string, config: string): Promise<Rule|null>;
    deleteRule(ruleType: string): Promise<null>;
    getRoleMappings(paging: Paging): Promise<RoleMappingSearchResults>;
    getRoleMapping(principalId: string): Promise<RoleMapping>;
    createRoleMapping(principalId: string, role: string, principalName: string): Promise<RoleMapping>;
    updateRoleMapping(principalId: string, role: string): Promise<RoleMapping>;
    deleteRoleMapping(principalId: string): Promise<null>;
    exportAs(filename: string): Promise<DownloadRef>;
    importFrom(file: string | File, progressFunction: (progressEvent: any) => void): Promise<void>;
    listConfigurationProperties(): Promise<ConfigurationProperty[]>;
    setConfigurationProperty(propertyName: string, newValue: string): Promise<void>;
    resetConfigurationProperty(propertyName: string): Promise<void>;
}


export const useAdminService: () => AdminService = (): AdminService => {
    const config: ConfigService = useConfigService();
    const auth: AuthService = useAuth();

    return {
        getArtifactTypes(): Promise<ArtifactTypeInfo[]> {
            return getArtifactTypes(config, auth);
        },
        getRules(): Promise<Rule[]> {
            return getRules(config, auth);
        },
        getRule(ruleType: string): Promise<Rule> {
            return getRule(config, auth, ruleType);
        },
        createRule(ruleType: string, configValue: string): Promise<Rule> {
            return createRule(config, auth, ruleType, configValue);
        },
        updateRule(ruleType: string, configValue: string): Promise<Rule|null> {
            return updateRule(config, auth, ruleType, configValue);
        },
        deleteRule(ruleType: string): Promise<null> {
            return deleteRule(config, auth, ruleType);
        },
        getRoleMappings(paging: Paging): Promise<RoleMappingSearchResults> {
            return getRoleMappings(config, auth, paging);
        },
        getRoleMapping(principalId: string): Promise<RoleMapping> {
            return getRoleMapping(config, auth, principalId);
        },
        createRoleMapping(principalId: string, role: string, principalName: string): Promise<RoleMapping> {
            return createRoleMapping(config, auth, principalId, role, principalName);
        },
        updateRoleMapping(principalId: string, role: string): Promise<RoleMapping> {
            return updateRoleMapping(config, auth, principalId, role);
        },
        deleteRoleMapping(principalId: string): Promise<null> {
            return deleteRoleMapping(config, auth, principalId);
        },
        exportAs(filename: string): Promise<DownloadRef> {
            return exportAs(config, auth, filename);
        },
        importFrom(file: string | File, progressFunction: (progressEvent: any) => void): Promise<void> {
            return importFrom(config, auth, file, progressFunction);
        },
        listConfigurationProperties(): Promise<ConfigurationProperty[]> {
            return listConfigurationProperties(config, auth);
        },
        setConfigurationProperty(propertyName: string, newValue: string): Promise<void> {
            return setConfigurationProperty(config, auth, propertyName, newValue);
        },
        resetConfigurationProperty(propertyName: string): Promise<void> {
            return resetConfigurationProperty(config, auth, propertyName);
        }
    };
};
