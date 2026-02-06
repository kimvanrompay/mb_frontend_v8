import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { I18nService } from '../services/i18n.service';

/**
 * HTTP Interceptor to add Accept-Language header to requests
 */
export const languageInterceptor: HttpInterceptorFn = (req, next) => {
    const i18nService = inject(I18nService);
    const currentLang = i18nService.getCurrentLanguage();

    const cloned = req.clone({
        headers: req.headers.set('Accept-Language', currentLang)
    });

    return next(cloned);
};
