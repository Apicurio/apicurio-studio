/**
 * @license
 * Copyright 2022 Red Hat
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

import {Injectable} from "@angular/core";
import {EditingInfo} from "../models/editingInfo.model";
import {LoggerService} from "./logger.service";
import {WindowRef} from "./window-ref.service";

const DEMO_CONTENT = `{
    "openapi": "3.0.2",
    "info": {
        "title": "Demo API",
        "version": "1.0.0",
        "description": "A sample API.",
        "termsOfService": "http://swagger.io/terms/"
    },
    "paths": {},
    "components": {}
}`;

/**
 * A service used to get access to the config information.
 */
@Injectable()
export class ConfigService {

    private resolve: any;
    private reject: any;

    private demoMode: boolean = false;
    private demoUrl: string | null = null;

    constructor(private window: WindowRef, private logger: LoggerService, private winRef: WindowRef) {
        this.logger.info("[ConfigService] Config service created.");

        const demoValue: string | undefined = this.getQueryParam("demo");
        if (demoValue !== undefined) {
            this.demoMode = true;
            if (demoValue !== "") {
                this.demoUrl = demoValue;
            }
        }

        if (!this.isDemoMode()) {
            this.window.window.onmessage = (evt: MessageEvent) => {
                this.logger.info("[ConfigService] OnMessage received: ", evt);
                if (evt.data && evt.data.type && evt.data.type === "apicurio-editingInfo") {
                    const ei: EditingInfo = evt.data.data as EditingInfo;
                    this.logger.info("[ConfigService] Editing Info received from parent frame: ", ei);
                    this.resolve(ei);
                }
            };
        }
    }

    public get(): Promise<EditingInfo> {
        if (this.demoMode) {
            return new Promise((resolve, reject) => {
                const info: EditingInfo = {
                    content: {
                        type: "OPENAPI",
                        value: DEMO_CONTENT
                    },
                    features: {
                        allowImports: false,
                        allowCustomValidations: false
                    }
                };
                resolve(info);
            });
        }
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }

    private isDemoMode(): boolean {
        return this.demoMode;
    }

    private getQueryParam(name: string): string | undefined {
        const query: string = this.winRef.window.location.search.substring(1);
        const vars: string[] = query.split("&");
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split("=");
            if (pair[0] === name) {
                if (pair.length > 1) {
                    return pair[1];
                } else {
                    return "";
                }
            }
        }
        return undefined;
    }

}
