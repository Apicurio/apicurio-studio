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
import {HttpClientService} from "./http-client.service";

/**
 * A service used to get access to the config information.
 */
@Injectable()
export class ConfigService {

  constructor(private window: WindowRef, private logger: LoggerService, private http: HttpClientService) {
  }

  public get(): Promise<EditingInfo> {
      this.logger.info("[ConfigService] Getting editing info.");
      const queryParams: any = new Proxy(this.window.window.location.search, {
          get: (searchParams, prop) => searchParams.get(prop),
      });
      const configUrl: string = queryParams.cfg;
      if (configUrl) {
          const endpoint: string = this.http.endpoint(configUrl);
          const options: any = this.http.options({ Accept: "application/json" });
          return this.http.httpGet<EditingInfo>(endpoint, options);
      }
      return Promise.reject({
          error: "Missing query parameter: cfg",
          code: 404
      });
  }

}
