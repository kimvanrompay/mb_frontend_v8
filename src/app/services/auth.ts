import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, BehaviorSubject, throwError } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: string;
  email: string;
  email_verified: boolean;
  email_verified_at: string | null;
  first_name: string;
  last_name: string;
  full_name: string;
  role: 'user' | 'admin' | 'owner';
  active: boolean;
  onboarding_completed: boolean;
  needs_onboarding: boolean;
  enneagram_priority_order: any;
  enneagram_priority_code: string | null;
  trial_ends_at?: string;
  tenant: {
    id: string;
    name: string;
    subdomain: string;
    company_onboarding_completed: boolean;
    needs_company_onboarding: boolean;
    company_culture_type: string | null;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export interface AuthError {
  message: string;
  title: string;
  code?: string | number;
  type: 'network' | 'server' | 'validation' | 'auth' | 'unknown';
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'https://api.meribas.app/api/v1';
  private readonly TOKEN_KEY = 'auth_token';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Current user state
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  /**
   * Load current user data from /me endpoint
   */
  loadMe(): Observable<{ user: User }> {
    if (!this.hasToken()) {
      return throwError(() => new Error('No token available'));
    }

    return this.http.get<{ user: User }>(`${this.API_URL}/auth/me`)
      .pipe(
        tap(response => {
          this.currentUserSubject.next(response.user);
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  /**
   * Get current user synchronously (from cache)
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.currentUserSubject.next(response.user);
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/register`, userData)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.currentUserSubject.next(response.user);
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  /**
   * Verify email with 6-digit code
   */
  verifyEmail(code: string): Observable<{ message: string; user: Partial<User> }> {
    return this.http.post<{ message: string; user: Partial<User> }>(
      `${this.API_URL}/auth/verify_email`,
      { code }
    ).pipe(
      tap(response => {
        // Update current user with verified status
        const currentUser = this.currentUserSubject.value;
        if (currentUser && response.user) {
          this.currentUserSubject.next({
            ...currentUser,
            ...response.user
          });
        }
      })
    );
  }

  /**
   * Resend verification code
   */
  resendVerification(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.API_URL}/auth/resend_verification`,
      {}
    );
  }

  /**
   * Update user data in the current user subject
   */
  updateUser(userData: Partial<User>): void {
    const currentUser = this.currentUserSubject.value;
    if (currentUser) {
      this.currentUserSubject.next({
        ...currentUser,
        ...userData
      });
    }
  }

  /**
   * Comprehensive error handler for authentication errors
   * Returns user-friendly error messages for all scenarios
   */
  handleAuthError(error: any, context: 'login' | 'register' = 'login'): AuthError {
    // Check if error is HttpErrorResponse
    if (error instanceof HttpErrorResponse) {
      // Network errors (no internet, timeout, etc.)
      if (error.status === 0) {
        return {
          type: 'network',
          title: 'Connection Error',
          message: 'Unable to connect to the server. Please check your internet connection and try again.',
          code: 0
        };
      }

      // Client errors (4xx)
      if (error.status >= 400 && error.status < 500) {
        switch (error.status) {
          case 400:
            return {
              type: 'validation',
              title: 'Invalid Request',
              message: error.error?.message || 'The information you provided is invalid. Please check and try again.',
              code: 400
            };

          case 401:
            if (context === 'login') {
              return {
                type: 'auth',
                title: 'Login Failed',
                message: error.error?.message || 'Invalid email or password. Please try again.',
                code: 401
              };
            } else {
              return {
                type: 'auth',
                title: 'Authentication Failed',
                message: error.error?.message || 'Unable to authenticate. Please try again.',
                code: 401
              };
            }

          case 403:
            return {
              type: 'auth',
              title: 'Access Denied',
              message: error.error?.message || 'You do not have permission to access this resource.',
              code: 403
            };

          case 404:
            return {
              type: 'server',
              title: 'Not Found',
              message: 'The authentication service could not be found. Please contact support.',
              code: 404
            };

          case 409:
            return {
              type: 'validation',
              title: 'Account Already Exists',
              message: error.error?.message || 'An account with this email already exists. Please login instead.',
              code: 409
            };

          case 422:
            return {
              type: 'validation',
              title: 'Validation Error',
              message: error.error?.message || this.extractValidationErrors(error.error),
              code: 422
            };

          case 429:
            return {
              type: 'server',
              title: 'Too Many Attempts',
              message: 'Too many login attempts. Please wait a few minutes before trying again.',
              code: 429
            };

          default:
            return {
              type: 'validation',
              title: 'Request Failed',
              message: error.error?.message || 'Something went wrong with your request. Please try again.',
              code: error.status
            };
        }
      }

      // Server errors (5xx)
      if (error.status >= 500) {
        switch (error.status) {
          case 500:
            return {
              type: 'server',
              title: 'Server Error',
              message: 'An internal server error occurred. Please try again later or contact support.',
              code: 500
            };

          case 502:
          case 503:
            return {
              type: 'server',
              title: 'Service Unavailable',
              message: 'The server is temporarily unavailable. Please try again in a few moments.',
              code: error.status
            };

          case 504:
            return {
              type: 'network',
              title: 'Request Timeout',
              message: 'The request took too long to complete. Please check your connection and try again.',
              code: 504
            };

          default:
            return {
              type: 'server',
              title: 'Server Error',
              message: 'A server error occurred. Please try again later.',
              code: error.status
            };
        }
      }
    }

    // Handle other error types
    if (error?.name === 'TimeoutError') {
      return {
        type: 'network',
        title: 'Request Timeout',
        message: 'The request took too long. Please try again.',
        code: 'TIMEOUT'
      };
    }

    // Generic/unknown errors
    return {
      type: 'unknown',
      title: 'Unexpected Error',
      message: error?.message || 'An unexpected error occurred. Please try again.',
      code: 'UNKNOWN'
    };
  }

  /**
   * Extract validation errors from error response
   */
  private extractValidationErrors(errorBody: any): string {
    if (!errorBody) return 'Please check your information and try again.';

    // Try to extract errors object
    if (errorBody.errors) {
      const errors = errorBody.errors;
      if (typeof errors === 'object') {
        const messages = Object.values(errors).flat();
        if (messages.length > 0) {
          return messages.join(' ');
        }
      }
    }

    // Try to extract error array
    if (Array.isArray(errorBody.error)) {
      return errorBody.error.join(' ');
    }

    return errorBody.message || 'Please check your information and try again.';
  }
}
