import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-navbar-centered',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <nav class="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-white/20">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          
          <!-- Logo (Left) -->
          <div class="flex-shrink-0">
             <a routerLink="/dashboard" class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-[var(--meribas-black)] flex items-center justify-center text-white font-bold font-mono">M</div>
                <span class="text-lg font-bold tracking-tight text-[var(--meribas-black)]">Meribas</span>
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
            <div class="ml-4 flex items-center md:ml-6">
              <button class="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                <span class="sr-only">View notifications</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              <!-- Profile dropdown -->
              <div class="relative ml-3">
                <div class="flex items-center gap-3">
                    <img class="h-8 w-8 rounded-full border border-gray-200" src="https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff" alt="">
                    <span class="text-sm font-medium text-gray-700">Admin</span>
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
export class NavbarCenteredComponent { }
