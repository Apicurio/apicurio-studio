import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from "./app.component";
import {OpenApiEditorComponent} from "./components/editors/openapi-editor.component";
import {ApicurioCommonComponentsModule, ApicurioEditorModule} from "apicurio-design-studio";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {ModalModule} from "ngx-bootstrap/modal";
import {BsDropdownModule} from "ngx-bootstrap/dropdown";

@NgModule({
    declarations: [
        AppComponent,
        OpenApiEditorComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        ModalModule.forRoot(),
        BsDropdownModule.forRoot(),
        ApicurioEditorModule,
        ApicurioCommonComponentsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
