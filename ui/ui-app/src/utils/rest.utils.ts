import axios, { AxiosRequestConfig } from "axios";
import { ContentTypes } from "@models/designs";

const AXIOS = axios.create();


function createAxiosConfig(method: string, url: string, options: any, data?: any): AxiosRequestConfig {
    if (typeof data === "string") {
        data = new Blob([data]);
    }
    return {
        ...{
            data,
            method,
            url,
            validateStatus: (status) => {
                return status >= 200 && status < 300;
            }
        }, ...options
    };
}


function unwrapErrorData(error: any): any {
    console.debug("Error detected, unwrapping...");
    if (error && error.response && error.response.data) {
        return {
            message: error.message,
            ...error.response.data,
            status: error.response.status
        };
    } else if (error && error.response) {
        return {
            message: error.message,
            status: error.response.status
        };
    } else if (error) {
        console.error("Unknown error detected: ", error);
        return {
            message: error.message,
            status: 500
        };
    } else {
        console.error("Unknown error detected: ", error);
        return {
            message: "Unknown error",
            status: 500
        };
    }
}

/**
 * Creates an endpoint to use when making a REST call.  Supports path params and query params.
 * @param baseHref
 * @param path
 * @param params
 * @param queryParams
 */
export function createEndpoint(baseHref: string, path: string, params?: any, queryParams?: any): string {
    if (params) {
        Object.keys(params).forEach(key => {
            const value: string = encodeURIComponent(params[key]);
            path = path.replace(":" + key, value);
        });
    }
    let rval: string = createHref(baseHref, path);
    if (queryParams) {
        let first: boolean = true;
        for (const key in queryParams) {
            if (queryParams[key]) {
                const value: string = encodeURIComponent(queryParams[key]);
                if (first) {
                    rval = rval + "?" + key;
                } else {
                    rval = rval + "&" + key;
                }
                if (value !== null && value !== undefined) {
                    rval = rval + "=" + value;
                }
                first = false;
            }
        }
    }
    return rval;
}

/**
 * Creates the request options used by the HTTP service when making API calls.
 * @param headers
 */
export function createOptions(headers: { [header: string]: string }): AxiosRequestConfig {
    return { headers };
}


/**
 * Performs an HTTP GET operation to the given URL with the given options.  Returns
 * a Promise to the HTTP response data.
 */
export function httpGet<T>(url: string, options?: AxiosRequestConfig, successCallback?: (value: any, response?: any) => T): Promise<T> {
    console.info("[BaseService] Making a GET request to: ", url);

    if (!options) {
        options = createOptions({ "Accept": ContentTypes.APPLICATION_JSON });
    }

    const config: AxiosRequestConfig = createAxiosConfig("get", url, options);
    return AXIOS.request(config)
        .then(response => {
            const data: T = response.data;
            if (successCallback) {
                return successCallback(data, response);
            } else {
                return data;
            }
        }).catch((error: any) => {
            return Promise.reject(unwrapErrorData(error));
        });
}

/**
 * Performs an HTTP POST operation to the given URL with the given body and options.  Returns
 * a Promise to null (no response data expected).
 * @param url
 * @param body
 * @param options
 * @param successCallback
 * @param progressCallback
 */
export function httpPost<I>(url: string, body: I, options?: AxiosRequestConfig, successCallback?: () => void,
                            progressCallback?: (progressEvent: any) => void): Promise<void> {
    console.info("[BaseService] Making a POST request to: ", url);

    if (!options) {
        options = createOptions({ "Content-Type": ContentTypes.APPLICATION_JSON });
    }

    const config: AxiosRequestConfig = createAxiosConfig("post", url, options, body);
    if (progressCallback) {
        const fiftyMB: number = 50 * 1024 * 1024;
        config.onUploadProgress = progressCallback;
        config.maxContentLength = fiftyMB;
        config.maxBodyLength = fiftyMB;
    }
    return AXIOS.request(config)
        .then(() => {
            if (successCallback) {
                return successCallback();
            } else {
                return;
            }
        }).catch((error: any) => {
            return Promise.reject(unwrapErrorData(error));
        });
}

/**
 * Performs an HTTP POST operation to the given URL with the given body and options.  Returns
 * a Promise to the HTTP response data.
 * @param url
 * @param body
 * @param options
 * @param successCallback
 */
export function httpPostWithReturn<I, O>(url: string, body: I, options?: AxiosRequestConfig, successCallback?: (data: any) => O): Promise<O> {
    console.info("[BaseService] Making a POST request to: ", url);

    if (!options) {
        options = createOptions({
            "Accept": ContentTypes.APPLICATION_JSON,
            "Content-Type": ContentTypes.APPLICATION_JSON
        });
    }

    const config: AxiosRequestConfig = createAxiosConfig("post", url, options, body);
    return AXIOS.request(config)
        .then(response => {
            const data: O = response.data;
            if (successCallback) {
                return successCallback(data);
            } else {
                return data;
            }
        }).catch((error: any) => {
            return Promise.reject(unwrapErrorData(error));
        });
}

/**
 * Performs an HTTP PUT operation to the given URL with the given body and options.  Returns
 * a Promise to null (no response data expected).
 * @param url
 * @param body
 * @param options
 * @param successCallback
 */
export function httpPut<I>(url: string, body: I, options?: AxiosRequestConfig, successCallback?: () => void): Promise<void> {
    console.info("[BaseService] Making a PUT request to: ", url);

    if (!options) {
        options = createOptions({ "Content-Type": ContentTypes.APPLICATION_JSON });
    }

    const config: AxiosRequestConfig = createAxiosConfig("put", url, options, body);
    return AXIOS.request(config)
        .then(() => {
            if (successCallback) {
                return successCallback();
            } else {
                return;
            }
        }).catch((error: any) => {
            return Promise.reject(unwrapErrorData(error));
        });
}

/**
 * Performs an HTTP PUT operation to the given URL with the given body and options.  Returns
 * a Promise to the HTTP response data.
 * @param url
 * @param body
 * @param options
 * @param successCallback
 */
export function httpPutWithReturn<I, O>(url: string, body: I, options?: AxiosRequestConfig, successCallback?: (data: O) => O): Promise<O> {
    console.info("[BaseService] Making a PUT request to: ", url);

    if (!options) {
        options = createOptions({
            "Accept": ContentTypes.APPLICATION_JSON,
            "Content-Type": ContentTypes.APPLICATION_JSON
        });
    }

    const config: AxiosRequestConfig = createAxiosConfig("put", url, options, body);
    return AXIOS.request(config)
        .then(response => {
            const data: O = response.data;
            if (successCallback) {
                return successCallback(data);
            } else {
                return data;
            }
        }).catch((error: any) => {
            return Promise.reject(unwrapErrorData(error));
        });
}

/**
 * Performs an HTTP DELETE operation to the given URL with the given body and options.
 * @param url
 * @param options
 * @param successCallback
 */
export function httpDelete<T>(url: string, options?: AxiosRequestConfig, successCallback?: () => T): Promise<T> {
    console.info("[BaseService] Making a DELETE request to: ", url);

    if (!options) {
        options = {};
    }

    const config: AxiosRequestConfig = createAxiosConfig("delete", url, options);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return AXIOS.request(config)
        .then(() => {
            return successCallback ? successCallback() : null;
        }).catch((error: any) => {
            return Promise.reject(unwrapErrorData(error));
        });
}

export function stripTrailingSlash(baseHref: string | undefined): string {
    if (!baseHref) {
        return "";
    }
    if (baseHref.endsWith("/")) {
        return baseHref.substring(0, baseHref.length - 1);
    }
    return baseHref;
}

export function createHref(baseHref: string, path: string): string {
    let url: string =  baseHref;
    if (url.endsWith("/")) {
        url = url.substring(0, url.length - 1);
    }
    url += path;
    return url;
}

