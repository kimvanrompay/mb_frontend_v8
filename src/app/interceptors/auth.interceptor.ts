import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

/**
 * HTTP Interceptor to add Authorization header to authenticated requests
 * Excludes login and register endpoints
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getToken();

    // List of endpoints that should NOT have the Authorization header
    const excludedEndpoints = [
        '/auth/login',
        '/auth/register'
    ];

    // Check if the current request URL ends with any excluded endpoint
    const isExcluded = excludedEndpoints.some(endpoint =>
        req.url.includes(endpoint)
    );

    // If we have a token AND the endpoint is not excluded, add Authorization header
    if (token && !isExcluded) {
        const cloned = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        return next(cloned);
    }

    // If no token or endpoint is excluded, pass the request through unchanged
    return next(req);
};
