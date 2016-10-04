import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {StudioModule}           from './studio.module';

const platform = platformBrowserDynamic();
platform.bootstrapModule(StudioModule);
