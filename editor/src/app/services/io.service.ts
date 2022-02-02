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
import {WindowRef} from "./window-ref.service";
import {EditingInfoFromHttp} from "../models/editingInfoFromHttp.model";
import {EditingInfoToFile} from "../models/editingInfoToFile.model";
import {EditingInfoFromFile} from "../models/editingInfoFromFile.model";
import {LoggerService} from "./logger.service";
import {EditingInfoToHttp} from "../models/editingInfoToHttp.model";
import {HttpClientService} from "./http-client.service";

/**
 * The common interface for all From handlers.
 */
export interface FromHandler {
    get(): Promise<string>;
}

/**
 * The common interface for all To handlers.
 */
export interface ToHandler {
    put(value: string): Promise<void>;
}

/**
 * A FROM handler that can load content from a local file.
 */
class FromFileHandler implements FromHandler {

    constructor(private fromConfig: EditingInfoFromFile, private window: WindowRef) {
    }

    get(): Promise<string> {
        // TODO implement this somehow
        return Promise.resolve(null);
    }
}

/**
 * A TO handler that can save content to a local file.
 */
class ToFileHandler implements ToHandler {

    constructor(private toConfig: EditingInfoToFile, private window: WindowRef) {
    }

    put(value: string): Promise<void> {
        const window: any = this.window.window;

        if (window.chrome !== undefined) {
            // Chrome version
            const link = document.createElement("a");
            const blob = new Blob([value], { type: "text/plain" });
            link.href = window.URL.createObjectURL(blob);
            link.download = "output.txt";
            link.click();
        } else if (window.navigator !== undefined && window.navigator.msSaveBlob !== undefined) {
            // IE version
            const blob = new Blob([value], { type: "text/plain" });
            window.navigator.msSaveBlob(blob, "output.txt");
        } else {
            // Firefox version
            const file = new File([value], "output.txt", { type: "application/force-download" });
            window.open(URL.createObjectURL(file));
        }

        return Promise.resolve();
    }
}


/**
 * A FROM handler that can load content by making an HTTP request.
 */
class FromHttpHandler implements FromHandler {

    constructor(private fromConfig: EditingInfoFromHttp, private http: HttpClientService) {
    }

    get(): Promise<string> {
        const url: string = this.http.endpoint(this.fromConfig.url);
        const options: any = this.http.options({ Accept: "*/*" });
        options.responseType = "text";
        return this.http.httpGet<string>(url, options);
        return Promise.resolve(null);
    }
}


/**
 * A TO handler that can save content by making an HTTP request (typically a POST or PUT).
 */
class ToHttpHandler implements ToHandler {

    constructor(private toConfig: EditingInfoToHttp, private http: HttpClientService) {
    }

    put(value: string): Promise<void> {
        // TODO implement this!
        return Promise.resolve(null);
    }

}


/**
 * A service used to handle input and output for the editor.
 */
@Injectable()
export class IOService {

    constructor(private window: WindowRef, private logger: LoggerService, private http: HttpClientService) {
    }

    public fromHandler(info: EditingInfo): FromHandler {
        this.logger.debug("[IOService] Creating FROM handler: %o", info.from);
        switch (info.from.type) {
            case "FILE":
                return new FromFileHandler(info.from as EditingInfoToFile, this.window);
            case "HTTP":
                return new FromHttpHandler(info.from as EditingInfoFromHttp, this.http);
        }
        throw new Error("Unsupported FROM type: " + info.from.type);
    }

    public toHandler(info: EditingInfo): ToHandler {
        this.logger.debug("[IOService] Creating TO handler: %o", info.to);
        switch (info.to.type) {
            case "FILE":
                return new ToFileHandler(info.to as EditingInfoToFile, this.window);
            case "HTTP":
                return new ToHttpHandler(info.to as EditingInfoFromHttp, this.http);
        }
        throw new Error("Unsupported TO type: " + info.to.type);
    }

}
