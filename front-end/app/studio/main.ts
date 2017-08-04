/**
 * @license
 * Copyright 2017 JBoss Inc
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

import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {StudioModule}           from "./studio.module";
import {enableProdMode} from '@angular/core';

let config = window["ApicurioStudioConfig"];
if (config.mode && config.mode === "prod") {
    console.info("[Main] Enabling angular production mode.");
    enableProdMode();
}

const platform = platformBrowserDynamic();
platform.bootstrapModule(StudioModule);

