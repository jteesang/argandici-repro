import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { API_BASE_URL } from './core/api-base-url.token';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideNoopAnimations(),
    { provide: API_BASE_URL, useValue: '/api' }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
