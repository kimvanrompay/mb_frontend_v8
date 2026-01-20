# User Loading on Every Page

## Overview
The app now automatically loads the current user's information via the `/api/v1/auth/me` endpoint when the app starts. The user data is available globally through the `AuthService`.

## How It Works

### 1. App Initialization
When the Angular app starts, the `APP_INITIALIZER` automatically:
- Checks if a token exists in `localStorage`
- If yes, calls `AuthService.loadMe()` to fetch user data
- Stores the user in `currentUserSubject` for global access
- If the API call fails, clears the invalid token

### 2. HTTP Interceptor
The `authInterceptor` automatically:
- Adds `Authorization: Bearer {token}` header to all HTTP requests
- No need to manually add headers in each service call

### 3. User State Management
The `AuthService` maintains user state through:
- `currentUserSubject`: BehaviorSubject<User | null>
- `currentUser$`: Observable for reactive programming
- `getCurrentUser()`: Synchronous access to cached user

## Usage in Components

### Get User Reactively (Recommended)
```typescript
import { Component, OnInit } from '@angular/core';
import { AuthService, User } from './services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  template: `
    <div *ngIf="user$ | async as user">
      <h1>Welcome, {{ user.full_name }}!</h1>
      <p>Email: {{ user.email }}</p>
      <p>Company: {{ user.tenant.name }}</p>
      <p>Role: {{ user.role }}</p>
      <p>Subdomain: {{ user.tenant.subdomain }}.meribas.app</p>
    </div>
  `
})
export class DashboardComponent {
  user$ = this.authService.currentUser$;

  constructor(private authService: AuthService) {}
}
```

### Get User Synchronously
```typescript
import { Component, OnInit } from '@angular/core';
import { AuthService, User } from './services/auth';

@Component({
  selector: 'app-profile',
  template: `
    <div *ngIf="user">
      <h2>{{ user.full_name }}</h2>
      <p>{{ user.email }}</p>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  user: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }
}
```

### Subscribe to User Changes
```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, User } from './services/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  template: `
    <div *ngIf="user">
      <img [src]="user.avatar" />
      <span>{{ user.first_name }}</span>
    </div>
  `
})
export class HeaderComponent implements OnInit, OnDestroy {
  user: User | null = null;
  private userSubscription?: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userSubscription = this.authService.currentUser$.subscribe(
      user => {
        this.user = user;
        console.log('User updated:', user);
      }
    );
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }
}
```

### Check User Role
```typescript
import { Component } from '@angular/core';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-admin-panel',
  template: `
    <div *ngIf="isAdmin">
      <h2>Admin Panel</h2>
      <!-- Admin content -->
    </div>
    <div *ngIf="!isAdmin">
      <p>Access denied</p>
    </div>
  `
})
export class AdminPanelComponent {
  get isAdmin(): boolean {
    const user = this.authService.getCurrentUser();
    return user?.role === 'admin' || user?.role === 'owner';
  }

  constructor(private authService: AuthService) {}
}
```

## User Interface

```typescript
export interface User {
  id: string;                    // UUID
  email: string;                 // user@example.com
  first_name: string;            // John
  last_name: string;             // Doe
  full_name: string;             // John Doe
  role: 'user' | 'admin' | 'owner';
  active: boolean;
  tenant: {
    id: string;                  // UUID
    name: string;                // Acme Corporation
    subdomain: string;           // acme
  };
}
```

## Benefits

✅ **Automatic Loading**: User data loaded on app start  
✅ **Global Access**: Available in any component via `AuthService`  
✅ **Reactive**: Use `currentUser$` observable for automatic UI updates  
✅ **Type-Safe**: Full TypeScript interfaces  
✅ **Cached**: No need to re-fetch on every page  
✅ **Interceptor**: Auth header automatically added to all requests  
✅ **Error Handling**: Invalid tokens automatically cleared  

## When User Data Updates

The `currentUser$` observable emits new values when:
1. User logs in (immediate after login)
2. User registers (immediate after signup)
3. App initializes (if token exists)
4. Manually call `authService.loadMe()` to refresh

## Force Refresh User Data

If you need to manually refresh user data:
```typescript
this.authService.loadMe().subscribe({
  next: (response) => {
    console.log('User refreshed:', response.user);
  },
  error: (error) => {
    console.error('Failed to refresh user:', error);
  }
});
```

## Example: Display User in Navbar

```typescript
@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  template: `
    <nav>
      <div *ngIf="user$ | async as user">
        <span>{{ user.full_name }}</span>
        <span class="text-sm">{{ user.tenant.name }}</span>
        <button (click)="logout()">Logout</button>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  user$ = this.authService.currentUser$;

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout(); // Clears user state and redirects to login
  }
}
```

## Notes

- User data is **NOT persisted** in localStorage (only the token is)
- User is re-fetched from API on every app reload
- If API returns 401, user is logged out automatically
- The `currentUser$` observable is a **BehaviorSubject**, so new subscribers immediately get the current value
