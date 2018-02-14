import { Component } from '@angular/core';
import { Config } from './shared/config/env.config';
import './operators';

/**
 * This class represents the main application component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-app',
  templateUrl: 'studio.component.html',
  styleUrls: ['studio.component.css'],
})
export class AppComponent {
  constructor() {
    console.log('Environment CONFIG', Config);
  }
}
