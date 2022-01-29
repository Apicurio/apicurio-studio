import Keycloak from "keycloak-js";
import {ConfigService} from "../config";
import {Service} from "../baseService";
import {AxiosRequestConfig} from "axios";
import {LoggerService} from "../logger";
import {UsersService} from "../users";

const KC_CONFIG_OPTIONS: string[] = ["url", "realm", "clientId"];
const KC_INIT_OPTIONS: string[] = [
    "useNonce", "adapter", "onLoad", "token", "refreshToken", "idToken", "timeSkew", "checkLoginIframe",
    "checkLoginIframeInterval", "responseMode", "redirectUri", "silentCheckSsoRedirectUri", "flow",
    "pkceMethod", "enableLogging"
];

function only(items: string[], allOptions: any): any {
    const rval: any = {};
    items.forEach(item => {
        if (allOptions[item] !== undefined) {
            rval[item] = allOptions[item];
        }
    });
    return rval;
}

export interface AuthenticatedUser {
    username: string;
    displayName: string;
    fullName: string;
}

/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */

export class AuthService implements Service {

    // @ts-ignore
    protected users: UsersService = null;

    private enabled: boolean = false;
    // @ts-ignore
    private config: ConfigService = null;
    // @ts-ignore
    private logger: LoggerService = null;
    // @ts-ignore
    private keycloak: Keycloak.KeycloakInstance;
    // @ts-ignore
    private user: AuthenticatedUser;

    public init = () => {
        // no init?
    }

    public authenticateUsingKeycloak = (onAuthenticatedCallback: () => void) => {
        const configOptions: any = only(KC_CONFIG_OPTIONS, this.config.authOptions());
        const initOptions: any = only(KC_INIT_OPTIONS, this.config.authOptions());

        this.keycloak = Keycloak(configOptions);

        const addRoles: ((user: AuthenticatedUser) => void) = (user) => {
            if (this.keycloak.resourceAccess) {
                Object.keys(this.keycloak.resourceAccess)
                    // @ts-ignore
                    .forEach(key => (user.roles = user.roles.concat(this.keycloak.resourceAccess[key].roles)));
            }

            this.logger.info("----------------");
            this.logger.info("Authenticated!  User info:", user);
            this.logger.info("----------------");
        };

        const fakeUser: (() => AuthenticatedUser) = () => {
            return {
                displayName: "User",
                fullName: "User",
                roles: [],
                username: "User"
            };
        };

        const infoToUser: (() => AuthenticatedUser) = () => {
            const ui: any = this.keycloak.userInfo;
            return {
                displayName: ui.given_name,
                fullName: ui.name,
                roles: [],
                username: ui.preferred_username
            };
        };

        this.keycloak.init(initOptions)
            .then((authenticated) => {
                if (authenticated) {
                    this.keycloak.loadUserInfo().then(() => {
                        this.user = infoToUser();
                        addRoles(this.user);
                        onAuthenticatedCallback();
                    }).catch(() => {
                        this.user = fakeUser();
                        addRoles(this.user);
                        onAuthenticatedCallback();
                    })
                } else {
                    // tslint:disable-next-line:no-console
                    console.warn("Not authenticated!");
                    this.doLogin();
                }
            })
    };

    public isAuthenticated = () => this.keycloak != null && this.keycloak.authenticated;

    public doLogin = () => this.keycloak.login;

    public doLogout = () =>  {
        this.keycloak.logout({
            redirectUri: window.location.href
        });
    }

    public getToken = () => this.keycloak.token;

    public isAuthenticationEnabled(): boolean {
        return this.enabled;
    }

    public authenticateAndRender(render: () => void): void {
        if (this.config.authType() === "keycloakjs") {
            this.enabled = true;
            this.authenticateUsingKeycloak(render);
        } else {
            this.enabled = false;
            render();
        }
    }

    public getAuthInterceptor(): (config: AxiosRequestConfig) => Promise<any> {
        const self: AuthService = this;
        const interceptor = (config: AxiosRequestConfig) => {
            if (self.config.authType() === "keycloakjs") {
                return self.updateKeycloakToken(() => {
                    config.headers.Authorization = `Bearer ${this.getToken()}`;
                    return Promise.resolve(config);
                });
            } else if (self.config.authType() === "gettoken") {
                this.logger.info("[AuthService] Using 'getToken' auth type.")
                return self.config.authGetToken()().then(token => {
                    this.logger.info("[AuthService] Token acquired.");
                    config.headers.Authorization = `Bearer ${token}`;
                    return Promise.resolve(config);
                });
            } else {
                return Promise.resolve(config);
            }
        };
        return interceptor;
    }

    // @ts-ignore
    private updateKeycloakToken = (successCallback) => {
        return this.keycloak.updateToken(5)
            .then(successCallback)
            .catch(this.doLogin)
    };
}
