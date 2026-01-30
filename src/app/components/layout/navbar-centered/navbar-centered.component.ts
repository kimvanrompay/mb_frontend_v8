import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar-centered',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="sticky top-0 z-50 bg-white border-b border-gray-200" *ngIf="authService.currentUser$ | async as user">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          
          <!-- Logo (Left) -->
          <div class="flex-shrink-0">
             <a routerLink="/dashboard" class="flex items-center gap-2 group">
                <div class="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white font-bold font-mono group-hover:bg-gray-800 transition-colors">
                    {{ user.tenant?.name?.charAt(0) || 'M' }}
                </div>
                <div class="flex flex-col">
                    <span class="text-sm font-bold tracking-tight text-black leading-none">{{ user.tenant?.name || 'Meribas' }}</span>
                    <span class="text-[10px] uppercase font-mono text-gray-500 leading-none mt-0.5">Production</span>
                </div>
             </a>
          </div>

          <!-- Centered Navigation -->
          <div class="hidden md:block">
            <div class="flex items-baseline space-x-1">
              <a routerLink="/dashboard" routerLinkActive="bg-black/5 text-black font-semibold" class="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-black hover:bg-black/5 transition-all">Dashboard</a>
              <a routerLink="/jobs" routerLinkActive="bg-black/5 text-black font-semibold" class="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-black hover:bg-black/5 transition-all">Jobs</a>
              <a routerLink="/applications" routerLinkActive="bg-black/5 text-black font-semibold" class="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-black hover:bg-black/5 transition-all">Applications</a>
              <a routerLink="/candidates" routerLinkActive="bg-black/5 text-black font-semibold" class="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-black hover:bg-black/5 transition-all">Candidates</a>
              <a routerLink="/collections" routerLinkActive="bg-black/5 text-black font-semibold" class="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-black hover:bg-black/5 transition-all">Collections</a>
              <a routerLink="/certs" routerLinkActive="bg-black/5 text-black font-semibold" class="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-black hover:bg-black/5 transition-all">Certs</a>
            </div>
          </div>

          <!-- User Profile (Right) -->
          <div class="hidden md:block">
            <div class="ml-4 flex items-center md:ml-6 gap-4">
              <button class="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                <span class="sr-only">View notifications</span>
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              <!-- Profile dropdown -->
              <div class="relative flex items-center gap-2 cursor-pointer">
                  <img class="h-6 w-6 rounded-full border border-gray-200" 
                       [src]="'https://ui-avatars.com/api/?name=' + (user.full_name || 'User') + '&background=000&color=fff&size=64'" 
                       alt="">
                  <span class="text-sm font-medium text-gray-700">{{ user.first_name }}</span>
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
}

