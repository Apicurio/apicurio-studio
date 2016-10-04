import {NgModule}            from '@angular/core';
import {BrowserModule}       from '@angular/platform-browser';
import {FormsModule}         from '@angular/forms';
import {HttpModule}          from '@angular/http';

// Imports for loading & configuring the in-memory web api
import {StudioComponent}     from './studio.component';
import {DashboardComponent}  from './pages/dashboard/dashboard.component';
import {StudioRouting}       from './studio.routing';
import {NavHeaderComponent}  from "./components/nav-header.component";

@NgModule({
    imports: [BrowserModule, FormsModule, HttpModule, StudioRouting],
    declarations: [StudioComponent, DashboardComponent, NavHeaderComponent],
    providers: [],
    bootstrap: [StudioComponent]
})
export class StudioModule {
}
