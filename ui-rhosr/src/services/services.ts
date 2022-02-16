/**
 * @license
 * Copyright 2021 Red Hat
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {TeamsService} from "./teams";
import {ConfigService} from "./config";
import {LoggerService} from "./logger";
import {AdminService} from "./admin";
import {Service} from "./baseService";
import {AuthService} from "./auth";
import {UsersService} from "./users";

/**
 * Class that provides access to all of the services in the application.
 */
export class Services {

    public static getTeamsService(): TeamsService {
        return Services.all.groups;
    }

    public static getConfigService(): ConfigService {
        return Services.all.config;
    }

    public static getLoggerService(): LoggerService {
        return Services.all.logger;
    }

    public static getAdminService(): AdminService {
        return Services.all.admin;
    }

    public static getAuthService(): AuthService {
        return Services.all.auth;
    }

    public static getUsersService(): UsersService {
        return Services.all.users;
    }

    private static all: any = {
        admin: new AdminService(),
        auth: new AuthService(),
        config: new ConfigService(),
        groups: new TeamsService(),
        logger: new LoggerService(),
        users: new UsersService(),
    };

    // tslint:disable-next-line:member-ordering member-access
    public static _intialize(): void {
        // tslint:disable-next-line:no-console
        console.info("[Services] _initialize() in Services");
        if (Services._isInit) {
            // tslint:disable-next-line:no-console
            console.info("[Services] Services already intialized...skipping.");
            return;
        }
        // tslint:disable-next-line:no-console
        console.info("[Services] Actually initializing Services!!!");
        // First perform simple service-service injection.
        Object.keys(Services.all).forEach( svcToInjectIntoName => {
            const svcToInjectInto: any = Services.all[svcToInjectIntoName];
            Object.keys(Services.all).filter(key => key !== svcToInjectIntoName).forEach(injectableSvcKey => {
                if (svcToInjectInto[injectableSvcKey] !== undefined && svcToInjectInto[injectableSvcKey] === null) {
                    svcToInjectInto[injectableSvcKey] = Services.all[injectableSvcKey];
                }
            })
        });
        // Once that's done, init() all the services
        Object.keys(Services.all).forEach( svcToInjectIntoName => {
            const svcToInit: Service = Services.all[svcToInjectIntoName];
            svcToInit.init();
        });
        Services._isInit = true;
        Services.getLoggerService().info("[Services] Services successfully initialized.");
    }

    // tslint:disable-next-line:variable-name
    private static _isInit: boolean = false;

}
Services._intialize();
