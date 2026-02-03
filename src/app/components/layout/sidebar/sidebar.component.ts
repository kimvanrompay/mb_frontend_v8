import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex flex-col w-64 h-full bg-white border-r border-gray-200">
      <!-- Logo Area -->
      <div class="h-16 flex items-center px-6 border-b border-gray-200">
        <a routerLink="/dashboard" class="flex items-center gap-2 group">
            <img src="https://res.cloudinary.com/dg0qxqj4a/image/upload/v1768848576/Boat_Logo_Black_na90ec.png" alt="Meribas" class="h-6 w-auto">
        </a>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        <!-- Core Assessment Tools -->
        <div class="space-y-1">
          <a routerLink="/dashboard" routerLinkActive="bg-gray-100 text-black font-medium" class="flex items-center px-3 py-2 text-sm font-normal text-gray-600 rounded-md hover:bg-gray-50 hover:text-black group transition-colors">
            <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Overview
          </a>
          
          <a routerLink="/jobs" routerLinkActive="bg-gray-100 text-black font-medium" class="flex items-center px-3 py-2 text-sm font-normal text-gray-600 rounded-md hover:bg-gray-50 hover:text-black group transition-colors">
            <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Positions
          </a>

          <a routerLink="/applications" routerLinkActive="bg-gray-100 text-black font-medium" class="flex items-center px-3 py-2 text-sm font-normal text-gray-600 rounded-md hover:bg-gray-50 hover:text-black group transition-colors">
             <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
             </svg>
             Assessments
          </a>

          <a routerLink="/candidates" routerLinkActive="bg-gray-100 text-black font-medium" class="flex items-center px-3 py-2 text-sm font-normal text-gray-600 rounded-md hover:bg-gray-50 hover:text-black group transition-colors">
             <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
             </svg>
             Candidates
          </a>

          <a routerLink="/invitations" routerLinkActive="bg-gray-100 text-black font-medium" class="flex items-center px-3 py-2 text-sm font-normal text-gray-600 rounded-md hover:bg-gray-50 hover:text-black group transition-colors">
             <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
             </svg>
             Invitations
          </a>
        </div>

        <!-- ASSESSMENT TOOLS Section -->
        <div>
          <div class="px-3 mb-2">
            <h3 class="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Assessment Tools</h3>
          </div>
          <div class="space-y-1">
            <a routerLink="/environment" routerLinkActive="bg-gray-100 text-black font-medium" class="flex items-center px-3 py-2 text-sm font-normal text-gray-600 rounded-md hover:bg-gray-50 hover:text-black group transition-colors">
              <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Test Library
            </a>
            <a routerLink="/deployments" routerLinkActive="bg-gray-100 text-black font-medium" class="flex items-center px-3 py-2 text-sm font-normal text-gray-600 rounded-md hover:bg-gray-50 hover:text-black group transition-colors">
              <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Interview Scheduler
            </a>
          </div>
        </div>

        <!-- ORGANIZATION Section -->
        <div>
          <div class="px-3 mb-2">
            <h3 class="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Organization</h3>
          </div>
          <div class="space-y-1">
            <a routerLink="/team" routerLinkActive="bg-gray-100 text-black font-medium" class="flex items-center px-3 py-2 text-sm font-normal text-gray-600 rounded-md hover:bg-gray-50 hover:text-black group transition-colors">
              <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Team & Permissions
            </a>
            <a routerLink="/billing" routerLinkActive="bg-gray-100 text-black font-medium" class="flex items-center px-3 py-2 text-sm font-normal text-gray-600 rounded-md hover:bg-gray-50 hover:text-black group transition-colors">
              <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Billing & Subscription
            </a>
          </div>
        </div>

        <!-- INTEGRATIONS Section -->
        <div>
          <div class="px-3 mb-2">
            <h3 class="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Integrations</h3>
          </div>
          <div class="space-y-1">
            <a routerLink="/integrations" routerLinkActive="bg-gray-100 text-black font-medium" class="flex items-center px-3 py-2 text-sm font-normal text-gray-600 rounded-md hover:bg-gray-50 hover:text-black group transition-colors">
               <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
               </svg>
               Integrations
            </a>

            <a routerLink="/invite-friend" routerLinkActive="bg-gray-100 text-black font-medium" class="flex items-center px-3 py-2 text-sm font-normal text-gray-600 rounded-md hover:bg-gray-50 hover:text-black group transition-colors">
               <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
               </svg>
               Invite a Friend
            </a>
          </div>
        </div>
      </nav>

      <!-- Bottom Actions -->
      <div class="p-3 border-t border-gray-200 space-y-3">
         <!-- Trial Countdown -->
         <div class="px-3 py-2 bg-red-50 border border-red-200 rounded-md">
            <div class="flex items-center justify-between mb-1">
               <span class="text-[10px] font-medium text-red-700 uppercase tracking-wide">Trial Period</span>
               <span class="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">14 days left</span>
            </div>
            <p class="text-[11px] text-red-600 leading-tight">Upgrade to unlock all features</p>
         </div>

         <a routerLink="/settings" routerLinkActive="bg-gray-100 text-black font-medium" class="flex items-center px-3 py-2 text-sm font-normal text-gray-600 rounded-md hover:bg-gray-50 hover:text-black group transition-colors">
            <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
            Settings
         </a>
         <a href="https://docs.meribas.app" target="_blank" class="flex items-center px-3 py-2 text-sm font-normal text-gray-600 rounded-md hover:bg-gray-50 hover:text-black group transition-colors">
            <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Help & Support
         </a>
      </div>
    </div>
  `
})
export class SidebarComponent { }
