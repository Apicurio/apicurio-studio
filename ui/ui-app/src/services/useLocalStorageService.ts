
function setConfigProperty(propertyName: string, propertyValue: string | object): void {
    console.info(`[LocalStorageService] Setting config property ${propertyName} to value ${propertyValue}.`);
    const value: string = typeof propertyValue === "string" ? propertyValue as string : JSON.stringify(propertyValue);
    localStorage.setItem("apicurio-studio." + propertyName, value);
}

function getConfigProperty(propertyName: string, defaultValue: string | object | undefined): string | object | undefined {
    console.info(`[LocalStorageService] Getting config property ${propertyName}`);
    const value: string|null = localStorage.getItem("apicurio-studio." + propertyName);
    if (!value) {
        return defaultValue;
    }
    if (value.startsWith("{")) {
        return JSON.parse(value);
    }
    return value as string;
}

function clearConfigProperty(propertyName: string): void {
    console.info(`[LocalStorageService] Clearing config property ${propertyName}`);
    localStorage.removeItem(propertyName);
}

/**
 * The Local Storage Service interface.
 */
export interface LocalStorageService {
    setConfigProperty(propertyName: string, propertyValue: string | object): void;
    getConfigProperty(propertyName: string, defaultValue: string | object | undefined): string | object | undefined;
    clearConfigProperty(propertyName: string): void;
}


/**
 * React hook to get the LocalStorage service.
 */
export const useLocalStorageService: () => LocalStorageService = (): LocalStorageService => {
    return {
        setConfigProperty,
        getConfigProperty,
        clearConfigProperty
    };
};
