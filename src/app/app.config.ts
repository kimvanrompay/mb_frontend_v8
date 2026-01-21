import { ApplicationConfig, provideBrowserGlobalErrorListeners, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors, HttpClient } from '@angular/common/http';
import { AuthService } from './services/auth';
import { authInterceptor } from './interceptors/auth.interceptor';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';

// Factory function to load user on app init
export function initializeApp(authService: AuthService) {
  return () => {
    // Only try to load user if we have a token
    if (authService.getToken()) {
      return authService.loadMe().toPromise().catch(() => {
        // If loading user fails, clear the token
        authService.logout();
        return Promise.resolve();
      });
    }
    return Promise.resolve();
  };
}

// Translation loader factory
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AuthService],
      multi: true
    }
  ]
};
