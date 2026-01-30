import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-sidebar-black',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="flex h-full w-64 flex-col bg-[var(--meribas-black)] text-white">
      <div class="flex h-16 items-center px-6">
        <span class="text-xl font-bold tracking-tight">MERIBAS</span>
        <span class="ml-2 rounded bg-[var(--meribas-charcoal)] px-1.5 py-0.5 text-xs font-medium text-gray-400">PRO</span>
      </div>

      <nav class="flex-1 space-y-1 px-3 py-4">
        <a routerLink="/dashboard" routerLinkActive="bg-[var(--meribas-charcoal)] text-white" 
           class="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[var(--meribas-charcoal)] hover:text-white">
           <svg class="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
           </svg>
           Dashboard
        </a>
        
        <a routerLink="/jobs" routerLinkActive="bg-[var(--meribas-charcoal)] text-white" 
           class="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[var(--meribas-charcoal)] hover:text-white">
           <svg class="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
           </svg>
           Assessments
        </a>

        <a href="#" class="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[var(--meribas-charcoal)] hover:text-white">
           <svg class="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
           </svg>
           Candidates
        </a>

        <a href="#" class="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[var(--meribas-charcoal)] hover:text-white">
           <svg class="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
           </svg>
           Analytics
        </a>
      </nav>

      <div class="border-t border-[var(--meribas-charcoal)] p-4">
        <div class="flex items-center">
          <div class="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center text-white text-xs font-bold">K</div>
          <div class="ml-3">
            <p class="text-sm font-medium text-white">Kim Van Rompay</p>
            <p class="text-xs text-gray-400">Admin</p>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: []
})
export class SidebarBlackComponent { }
