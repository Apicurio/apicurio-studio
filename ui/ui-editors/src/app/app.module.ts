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

import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AppComponent} from "./app.component";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {ModalModule} from "ngx-bootstrap/modal";
import {BsDropdownModule} from "ngx-bootstrap/dropdown";
import {LoggerService} from "./services/logger.service";
import {ConfigService} from "./services/config.service";
import {WindowRef} from "./services/window-ref.service";
import {ApicurioEditorModule} from "./editor.module";
import {AsyncApiEditorComponent} from "./components/editors/asyncapi-editor.component";
import {OpenApiEditorComponent} from "./components/editors/openapi-editor.component";

@NgModule({
    declarations: [
        AppComponent,
        OpenApiEditorComponent,
        AsyncApiEditorComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        ModalModule.forRoot(),
        BsDropdownModule.forRoot(),
        ApicurioEditorModule
    ],
    providers: [
        WindowRef,
        LoggerService,
        ConfigService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
