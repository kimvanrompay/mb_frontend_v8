import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar-centered',
  standalone: true,
  imports: [CommonModule],
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

             <div class="flex flex-col">
                <div class="flex items-center text-xs font-mono text-gray-500 gap-2">
                    <span>{{ user.tenant.name || 'Meribas' }}</span>
                    <span>/</span>
                    <span class="text-gray-400">Production</span>
                    <span *ngIf="currentPage" class="flex items-center gap-2">
                        <span>/</span>
                        <span class="text-black font-medium">{{ currentPage }}</span>
                    </span>
                </div>
             </div>
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
            <div class="relative flex items-center gap-2 cursor-pointer group">
              <img class="h-7 w-7 rounded-full border border-gray-200" 
                   [src]="'https://ui-avatars.com/api/?name=' + (user.full_name || 'User') + '&background=000&color=fff&size=64'" 
                   alt="">
              <div class="hidden md:flex flex-col">
                <span class="text-sm font-medium text-gray-700 group-hover:text-black transition-colors">{{ user.first_name }}</span>
                <span class="text-[10px] text-gray-400 font-mono">{{ user.email }}</span>
              </div>
              <svg class="h-4 w-4 text-gray-400 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
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

  private readonly routeNames: { [key: string]: string } = {
    'dashboard': 'Dashboard',
    'jobs': 'Jobs',
    'candidates': 'Candidates',
    'assessments': 'Assessments',
    'integrations': 'Integrations',
    'invite-friend': 'Invite a Friend',
    'settings': 'Settings'
  };

  ngOnInit() {
    // Update current page on route changes
    this.router.events.subscribe(() => {
      this.updateCurrentPage();
    });

    this.updateCurrentPage();
  }

  private updateCurrentPage() {
    const path = this.router.url;
    const segments = path.split('/').filter(s => s);

    if (segments.length > 1) {
      const mainRoute = segments[1];
      this.currentPage = this.routeNames[mainRoute] || mainRoute;
    } else {
      this.currentPage = '';
    }
  }
}
