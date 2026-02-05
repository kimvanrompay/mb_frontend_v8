// DUAL-PANE NAVIGATION SYSTEM - M3 Architecture
// Rail (80px) + Contextual Drawer (280px) = Google M3 Docs Style

import { Component, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- DUAL-PANE CONTAINER -->
    <div class="flex h-full">
      
      <!-- COLUMN 1: NAVIGATION RAIL (80px - The Strategy) -->
      <nav class="w-[80px] h-full flex flex-col items-center py-4 bg-[#FDFDFD] border-r border-[#E0E2E5] z-20 shrink-0">
        
        <!-- Menu Toggle -->
        <button class="w-12 h-12 rounded-full hover:bg-gray-100 flex items-center justify-center mb-6 text-[#444746]">
          <span class="material-icons text-[24px]">menu</span>
        </button>
        
        <!-- Rail Item: Home (Active) -->
        <a routerLink="/dashboard" 
           routerLinkActive="active-rail"
           [routerLinkActiveOptions]="{exact: true}"
           class="flex flex-col items-center gap-1 mb-6 group w-full">
          <div class="w-14 h-8 rounded-[16px] bg-[#C4F5DA] flex items-center justify-center mb-1 transition-all">
            <span class="material-icons text-[#052112] text-[24px]">dashboard</span>
          </div>
          <span class="text-[12px] font-bold text-[#1C1B1F]">Home</span>
        </a>

        <!-- Rail Item: Hiring -->
        <a routerLink="/jobs" 
           routerLinkActive="active-rail"
           class="flex flex-col items-center gap-1 mb-6 group w-full text-[#444746] hover:text-[#1C1B1F]">
          <div class="w-14 h-8 rounded-[16px] group-hover:bg-[#E0E2E5] flex items-center justify-center mb-1 transition-all">
            <span class="material-icons text-[24px]">work</span>
          </div>
          <span class="text-[12px] font-medium">Hiring</span>
        </a>

        <!-- Rail Item: Library -->
        <a routerLink="/applications" 
           routerLinkActive="active-rail"
           class="flex flex-col items-center gap-1 mb-6 group w-full text-[#444746] hover:text-[#1C1B1F]">
          <div class="w-14 h-8 rounded-[16px] group-hover:bg-[#E0E2E5] flex items-center justify-center mb-1 transition-all">
            <span class="material-icons text-[24px]">library_books</span>
          </div>
          <span class="text-[12px] font-medium">Library</span>
        </a>
        
        <!-- Rail Item: Admin -->
        <a routerLink="/settings" 
           routerLinkActive="active-rail"
           class="flex flex-col items-center gap-1 mb-6 group w-full text-[#444746] hover:text-[#1C1B1F]">
          <div class="w-14 h-8 rounded-[16px] group-hover:bg-[#E0E2E5] flex items-center justify-center mb-1 transition-all">
            <span class="material-icons text-[24px]">settings</span>
          </div>
          <span class="text-[12px] font-medium">Admin</span>
        </a>

      </nav>

      <!-- COLUMN 2: CONTEXTUAL DRAWER (280px - The Tactics) -->
      <aside class="w-[280px] h-full bg-[#F3F4F6] flex flex-col p-4 z-10 shrink-0">
        
        <!-- Drawer Header -->
        <div class="h-16 flex items-center px-4 mb-2">
          <span class="text-[22px] font-normal text-[#1C1B1F]">Overview</span>
        </div>

        <!-- FAB Action Button -->
        <button class="h-14 w-full mb-6 rounded-[16px] bg-[#D1FAE5] hover:bg-[#A7F3D0] 
                       text-[#064E3B] font-semibold text-[14px] 
                       flex items-center justify-center gap-2 shadow-sm transition-all">
          <span class="material-icons text-[20px]">add</span>
          <span>Invite Candidate</span>
        </button>

        <!-- Navigation List -->
        <nav class="flex-1 overflow-y-auto flex flex-col gap-1">
          
          <!-- Section: Primary -->
          <div class="px-4 py-3 text-[11px] font-bold text-[#444746] uppercase tracking-wider">
            Primary
          </div>

          <a routerLink="/dashboard"
             routerLinkActive="bg-[#E8DEF8] text-[#1D192B] font-bold"
             [routerLinkActiveOptions]="{exact: true}"
             class="h-[56px] px-6 rounded-full hover:bg-[#E0E2E5] 
                    flex items-center gap-3 text-[#444746] font-medium text-[14px] transition-colors">
            <span class="material-icons text-[20px]">dashboard</span>
            <span>Overview</span>
          </a>

          <a routerLink="/jobs"
             routerLinkActive="bg-[#E8DEF8] text-[#1D192B] font-bold"
             class="h-[56px] px-6 rounded-full hover:bg-[#E0E2E5] 
                    flex items-center gap-3 text-[#444746] font-medium text-[14px] transition-colors">
            <span class="material-icons text-[20px]">work</span>
            <span>Positions</span>
          </a>
          
          <a routerLink="/applications"
             routerLinkActive="bg-[#E8DEF8] text-[#1D192B] font-bold"
             class="h-[56px] px-6 rounded-full hover:bg-[#E0E2E5] 
                    flex items-center gap-3 text-[#444746] font-medium text-[14px] transition-colors">
            <span class="material-icons text-[20px]">assignment</span>
            <span>Assessments</span>
          </a>

          <a routerLink="/candidates"
             routerLinkActive="bg-[#E8DEF8] text-[#1D192B] font-bold"
             class="h-[56px] px-6 rounded-full hover:bg-[#E0E2E5] 
                    flex items-center gap-3 text-[#444746] font-medium text-[14px] transition-colors">
            <span class="material-icons text-[20px]">people</span>
            <span>Candidates</span>
          </a>

          <a routerLink="/invitations"
             routerLinkActive="bg-[#E8DEF8] text-[#1D192B] font-bold"
             class="h-[56px] px-6 rounded-full hover:bg-[#E0E2E5] 
                    flex items-center gap-3 text-[#444746] font-medium text-[14px] transition-colors">
            <span class="material-icons text-[20px]">mail</span>
            <span>Invitations</span>
          </a>
          
          <!-- Divider -->
          <div class="my-2 border-t border-[#E0E2E5] mx-4"></div>
          
          <!-- Section: Assessment Tools -->
          <div class="px-4 py-3 text-[11px] font-bold text-[#444746] uppercase tracking-wider">
            Assessment Tools
          </div>
          
          <a routerLink="/environment"
             routerLinkActive="bg-[#E8DEF8] text-[#1D192B] font-bold"
             class="h-[56px] px-6 rounded-full hover:bg-[#E0E2E5] 
                    flex items-center gap-3 text-[#444746] font-medium text-[14px] transition-colors">
            <span class="material-icons text-[20px]">science</span>
            <span>Test Library</span>
          </a>

          <a routerLink="/deployments"
             routerLinkActive="bg-[#E8DEF8] text-[#1D192B] font-bold"
             class="h-[56px] px-6 rounded-full hover:bg-[#E0E2E5] 
                    flex items-center gap-3 text-[#444746] font-medium text-[14px] transition-colors">
            <span class="material-icons text-[20px]">calendar_month</span>
            <span>Interview Scheduler</span>
          </a>

        </nav>

        <!-- Bottom Section -->
        <div class="pt-4 border-t border-[#E0E2E5]">
          
          <!-- Trial Banner -->
          <div class="mb-3 px-4 py-3 bg-[#FDECEA] rounded-[12px]">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] font-bold text-[#B3261E] uppercase tracking-wide">
                Trial Period
              </span>
              <span class="px-2 py-0.5 bg-[#B3261E] text-white text-[10px] font-bold rounded-full">
                14 days left
              </span>
            </div>
            <p class="text-[11px] text-[#B3261E] leading-tight">
              Upgrade to unlock all features
            </p>
          </div>

          <!-- Settings -->
          <a routerLink="/settings"
             class="h-12 px-4 rounded-[12px] hover:bg-[#E0E2E5] 
                    flex items-center gap-3 text-[#444746] font-medium text-[14px] transition-colors">
            <span class="material-icons text-[20px]">settings</span>
            <span>Settings</span>
          </a>

        </div>

      </aside>

    </div>
  `
})
export class SidebarComponent {
  constructor(private elementRef: ElementRef) {}
}
