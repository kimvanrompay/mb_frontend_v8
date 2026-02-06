import { ApplicationConfig, provideBrowserGlobalErrorListeners, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { AuthService } from './services/auth';
import { I18nService } from './services/i18n.service';
import { authInterceptor } from './interceptors/auth.interceptor';
import { languageInterceptor } from './interceptors/language.interceptor';

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

// Factory function to initialize i18n
export function initializeI18n(i18nService: I18nService) {
  return () => {
    // Actually wait for translations to load
    return i18nService.initialize();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, languageInterceptor])
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeI18n,
      deps: [I18nService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AuthService],
      multi: true
    }
  ]
};
