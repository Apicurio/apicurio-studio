import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {APP_BASE_HREF} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './studio.component';

import {SharedModule} from './shared/shared.module';
import {AppRouting} from "./studio-routing";
import {AboutComponent} from "./about/about.component";
import {HomeComponent} from "./home/home.component";


@NgModule({
  imports: [BrowserModule, HttpClientModule, AppRouting, SharedModule.forRoot()],
  declarations: [AppComponent, AboutComponent, HomeComponent ],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  }],
  bootstrap: [AppComponent]

})
export class StudioModule { }
