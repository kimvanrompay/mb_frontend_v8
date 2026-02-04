import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar-centered',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="sticky top-0 z-50 bg-white border-b border-gray-200" *ngIf="authService.currentUser$ | async as user">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          
          <!-- Context/Breadcrumb (Left) -->
          <div class="flex items-center gap-4">
             <!-- Mobile Menu Button -->
             <button class="md:hidden text-gray-500 hover:text-black">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
             </button>

             <!-- Breadcrumbs -->
             <nav class="hidden md:flex items-center text-sm font-medium text-gray-500">
                <a routerLink="/dashboard" class="flex items-center hover:text-gray-900 transition-colors">
                    <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Home
                </a>
                
                <ng-container *ngFor="let crumb of breadcrumbs">
                  <svg class="h-5 w-5 text-gray-300 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                  <a [routerLink]="crumb.url" 
                     [class.text-gray-900]="crumb.active"
                     [class.font-semibold]="crumb.active"
                     [class.pointer-events-none]="crumb.active"
                     class="hover:text-gray-900 transition-colors">
                     {{ crumb.label }}
                  </a>
                </ng-container>
             </nav>
          </div>

          <!-- User Profile (Right) -->
          <div class="flex items-center gap-4">
            <!-- Notification Bell -->
            <button class="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none relative">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white"></span>
            </button>

            <!-- User Profile -->
            <div class="relative">
              <div (click)="toggleDropdown()" class="flex items-center gap-2 cursor-pointer group">
                <img class="h-7 w-7 rounded-full border border-gray-200" 
                     [src]="'https://ui-avatars.com/api/?name=' + (user.full_name || 'User') + '&background=000&color=fff&size=64'" 
                     alt="">
                <div class="hidden md:flex flex-col">
                  <span class="text-sm font-medium text-gray-700 group-hover:text-black transition-colors">{{ user.first_name }}</span>
                  <span class="text-[10px] text-gray-400 font-mono">{{ user.email }}</span>
                </div>
                <svg class="h-4 w-4 text-gray-400 hidden md:block transition-transform" 
                     [class.rotate-180]="isDropdownOpen"
                     fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <!-- Dropdown Menu -->
              <div *ngIf="isDropdownOpen" 
                   class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div class="px-4 py-3 border-b border-gray-100">
                  <p class="text-sm font-medium text-gray-900">{{ user.full_name }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ user.email }}</p>
                  <p class="text-[10px] text-gray-400 font-mono mt-2">Tenant: {{ user.tenant.id || 'N/A' }}</p>
                </div>
                
                <a routerLink="/settings" (click)="closeDropdown()"
                   class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </a>

                <a href="https://docs.meribas.app" target="_blank" (click)="closeDropdown()"
                   class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Help & Support
                </a>

                <div class="border-t border-gray-100 mt-2 pt-2">
                  <button (click)="logout()" 
                          class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </nav>
  `,
  styles: []
})
export class NavbarCenteredComponent {
  authService = inject(AuthService);
  router = inject(Router);
  currentPage = '';
  breadcrumbs: { label: string, url: string, active: boolean }[] = [];
  isDropdownOpen = false;

  private readonly routeNames: { [key: string]: string } = {
    'dashboard': 'Dashboard',
    'jobs': 'Positions', // Updated to match sidebar
    'candidates': 'Candidates',
    'invitations': 'Invitations',
    'applications': 'Applications',
    'assessments': 'Assessments',
    'integrations': 'Integrations',
    'invite-friend': 'Invite Friend',
    'settings': 'Settings',
    'billing': 'Billing',
    'team': 'Team'
  };

  ngOnInit() {
    // Update breadcrumbs on route changes
    this.router.events.subscribe(() => {
      this.updateBreadcrumbs();
    });

    this.updateBreadcrumbs();
  }

  private updateBreadcrumbs() {
    const path = this.router.url;
    // Remove query params if any
    const cleanPath = path.split('?')[0];
    const segments = cleanPath.split('/').filter(s => s);

    this.breadcrumbs = segments.map((segment, index) => {
      const url = '/' + segments.slice(0, index + 1).join('/');
      let label = this.routeNames[segment] || segment;

      // Capitalize if it's an ID or dynamic segment (simple heuristic)
      if (!this.routeNames[segment]) {
        // If it's the last segment and look like an ID (long string/numbers), maybe just say "Details" or keep ID
        if (segment.length > 20) {
          label = 'Details';
        } else {
          label = segment.charAt(0).toUpperCase() + segment.slice(1);
        }
      }

      return {
        label: label,
        url: url,
        active: index === segments.length - 1
      };
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  logout() {
    this.closeDropdown();
    this.authService.logout();
  }
}
