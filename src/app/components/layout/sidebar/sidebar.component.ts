// COMPLETE M3 NAVIGATION DRAWER - READY FOR IMPLEMENTATION
// Replace the content of: src/app/components/layout/sidebar/sidebar.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- M3 Standard Navigation Drawer -->
    <div class="flex flex-col w-[280px] h-full bg-surface-container-low">
      
      <!-- Logo Area -->
      <div class="h-16 flex items-center px-6">
        <a routerLink="/dashboard" class="flex items-center gap-2">
          <img src="https://res.cloudinary.com/dg0qxqj4a/image/upload/v1768848576/Boat_Logo_Black_na90ec.png" 
               alt="Meribas" class="h-6 w-auto">
        </a>
      </div>

      <!-- Extended FAB (Primary Action) -->
      <div class="px-4 pb-4">
        <a routerLink="/candidates" 
           class="h-14 w-full bg-primary-container text-on-primary-container rounded-m3-lg 
                  flex items-center justify-center gap-2 font-medium text-sm 
                  shadow-m3-1 hover:shadow-m3-2 transition-all">
          <span class="material-icons text-xl">person_add</span>
          <span>Invite Candidate</span>
        </a>
      </div>

      <!-- Navigation Items -->
      <nav class="flex-1 overflow-y-auto px-3 py-2">
        
        <!-- Primary Navigation -->
        <div class="space-y-1 mb-4">
          
          <!-- Overview -->
          <a routerLink="/dashboard" 
             routerLinkActive="bg-secondary-container text-on-secondary-container font-bold"
             [routerLinkActiveOptions]="{exact: true}"
             class="h-14 px-6 flex items-center gap-4 
                    text-on-surface-variant rounded-m3-full
                    hover:bg-surface-container-high transition-colors">
            <span class="material-icons">dashboard</span>
            <span class="text-sm">Overview</span>
          </a>

          <!-- Positions -->
          <a routerLink="/jobs" 
             routerLinkActive="bg-secondary-container text-on-secondary-container font-bold"
             class="h-14 px-6 flex items-center gap-4 
                    text-on-surface-variant rounded-m3-full
                    hover:bg-surface-container-high transition-colors">
            <span class="material-icons">work</span>
            <span class="text-sm">Positions</span>
          </a>

          <!-- Assessments -->
          <a routerLink="/applications" 
             routerLinkActive="bg-secondary-container text-on-secondary-container font-bold"
             class="h-14 px-6 flex items-center gap-4 
                    text-on-surface-variant rounded-m3-full
                    hover:bg-surface-container-high transition-colors">
            <span class="material-icons">assignment</span>
            <span class="text-sm">Assessments</span>
          </a>

          <!-- Candidates (Active Pill Example) -->
          <a routerLink="/candidates" 
             routerLinkActive="bg-secondary-container text-on-secondary-container font-bold"
             class="h-14 px-6 flex items-center gap-4 
                    text-on-surface-variant rounded-m3-full
                    hover:bg-surface-container-high transition-colors">
            <span class="material-icons">people</span>
            <span class="text-sm">Candidates</span>
          </a>

          <!-- Invitations -->
          <a routerLink="/invitations" 
             routerLinkActive="bg-secondary-container text-on-secondary-container font-bold"
             class="h-14 px-6 flex items-center gap-4 
                    text-on-surface-variant rounded-m3-full
                    hover:bg-surface-container-high transition-colors">
            <span class="material-icons">mail</span>
            <span class="text-sm">Invitations</span>
          </a>

        </div>

        <!-- Section Divider -->
        <div class="h-px bg-outline-variant my-4"></div>

        <!-- ASSESSMENT TOOLS Section -->
        <div class="mb-4">
          <!-- Section Header -->
          <div class="px-6 py-2 mb-1">
            <h3 class="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              Assessment Tools
            </h3>
          </div>

          <div class="space-y-1">
            <!-- Test Library -->
            <a routerLink="/environment" 
               routerLinkActive="bg-secondary-container text-on-secondary-container font-bold"
               class="h-14 px-6 flex items-center gap-4 
                      text-on-surface-variant rounded-m3-full
                      hover:bg-surface-container-high transition-colors">
              <span class="material-icons">library_books</span>
              <span class="text-sm">Test Library</span>
            </a>

            <!-- Interview Scheduler -->
            <a routerLink="/deployments" 
               routerLinkActive="bg-secondary-container text-on-secondary-container font-bold"
               class="h-14 px-6 flex items-center gap-4 
                      text-on-surface-variant rounded-m3-full
                      hover:bg-surface-container-high transition-colors">
              <span class="material-icons">calendar_month</span>
              <span class="text-sm">Interview Scheduler</span>
            </a>
          </div>
        </div>

        <!-- Section Divider -->
        <div class="h-px bg-outline-variant my-4"></div>

        <!-- ORGANIZATION Section -->
        <div class="mb-4">
          <!-- Section Header -->
          <div class="px-6 py-2 mb-1">
            <h3 class="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              Organization
            </h3>
          </div>

          <div class="space-y-1">
            <!-- Team & Permissions -->
            <a routerLink="/team" 
               routerLinkActive="bg-secondary-container text-on-secondary-container font-bold"
               class="h-14 px-6 flex items-center gap-4 
                      text-on-surface-variant rounded-m3-full
                      hover:bg-surface-container-high transition-colors">
              <span class="material-icons">groups</span>
              <span class="text-sm">Team & Permissions</span>
            </a>

            <!-- Billing & Subscription -->
            <a routerLink="/billing" 
               routerLinkActive="bg-secondary-container text-on-secondary-container font-bold"
               class="h-14 px-6 flex items-center gap-4 
                      text-on-surface-variant rounded-m3-full
                      hover:bg-surface-container-high transition-colors">
              <span class="material-icons">credit_card</span>
              <span class="text-sm">Billing & Subscription</span>
            </a>
          </div>
        </div>

        <!-- Section Divider -->
        <div class="h-px bg-outline-variant my-4"></div>

        <!-- INTEGRATIONS Section -->
        <div>
          <!-- Section Header -->
          <div class="px-6 py-2 mb-1">
            <h3 class="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              Integrations
            </h3>
          </div>

          <div class="space-y-1">
            <!-- Integrations -->
            <a routerLink="/integrations" 
               routerLinkActive="bg-secondary-container text-on-secondary-container font-bold"
               class="h-14 px-6 flex items-center gap-4 
                      text-on-surface-variant rounded-m3-full
                      hover:bg-surface-container-high transition-colors">
              <span class="material-icons">extension</span>
              <span class="text-sm">Integrations</span>
            </a>

            <!-- Invite a Friend -->
            <a routerLink="/invite-friend" 
               routerLinkActive="bg-secondary-container text-on-secondary-container font-bold"
               class="h-14 px-6 flex items-center gap-4 
                      text-on-surface-variant rounded-m3-full
                      hover:bg-surface-container-high transition-colors">
              <span class="material-icons">person_add_alt</span>
              <span class="text-sm">Invite a Friend</span>
            </a>
          </div>
        </div>

      </nav>

      <!-- Bottom Section (Settings + Trial Banner) -->
      <div class="p-4 border-t border-outline-variant">
        
        <!-- Trial Banner (M3 Filled Card Style) -->
        <div class="mb-3 px-4 py-3 bg-error-container rounded-m3-md">
          <div class="flex items-center justify-between mb-1">
            <span class="text-[10px] font-bold text-error uppercase tracking-wide">
              Trial Period
            </span>
            <span class="px-2 py-0.5 bg-error text-on-primary text-[10px] font-bold rounded-m3-full">
              14 days left
            </span>
          </div>
          <p class="text-[11px] text-error leading-tight">
            Upgrade to unlock all features
          </p>
        </div>

        <!-- Settings -->
        <a routerLink="/settings" 
           routerLinkActive="bg-secondary-container text-on-secondary-container font-bold"
           class="h-12 px-4 flex items-center gap-3 
                  text-on-surface-variant rounded-m3-md
                  hover:bg-surface-container-high transition-colors">
          <span class="material-icons">settings</span>
          <span class="text-sm">Settings</span>
        </a>

        <!-- Help & Support -->
        <a href="https://docs.meribas.app" 
           target="_blank" 
           class="h-12 px-4 flex items-center gap-3 
                  text-on-surface-variant rounded-m3-md
                  hover:bg-surface-container-high transition-colors">
          <span class="material-icons">help</span>
          <span class="text-sm">Help & Support</span>
        </a>

      </div>

    </div>
  `
})
export class SidebarComponent { }

/*
═══════════════════════════════════════════════════════════════════════════════
M3 NAVIGATION DRAWER - IMPLEMENTATION GUIDE
═══════════════════════════════════════════════════════════════════════════════

WHAT THIS INCLUDES:
✅ Extended FAB at top (Invite Candidate)
✅ Active pill indicators (secondary-container background)
✅ Section dividers (1px outline-variant)
✅ Section headers (uppercase, tracking-wider)
✅ Material Icons (person_add, dashboard, work, etc.)
✅ M3 hover states (surface-container-high)
✅ M3 rounded corners (m3-full for pills, m3-lg for FAB)
✅ M3 elevation (shadow-m3-1 and m3-2)
✅ M3 color tokens (surface-container-low bg, on-surface-variant text)
✅ Trial banner with M3 filled card style
✅ Proper spacing and density

HOW THE ACTIVE PILL WORKS:
When you navigate to "/candidates", the routerLinkActive directive adds:
- bg-secondary-container (light green background)
- text-on-secondary-container (dark text)
- font-bold

This creates the "pressed button" effect seen in Gmail, Google Drive, etc.

MATERIAL ICONS USED:
- person_add (Invite)
- dashboard (Overview)
- work (Positions)
- assignment (Assessments)
- people (Candidates)
- mail (Invitations)
- library_books (Test Library)
- calendar_month (Interview Scheduler)
- groups (Team)
- credit_card (Billing)
- extension (Integrations)
- person_add_alt (Invite Friend)
- settings (Settings)
- help (Help & Support)

TO APPLY THIS:
1. Copy this entire file content
2. Replace src/app/components/layout/sidebar/sidebar.component.ts
3. Save and rebuild
4. The sidebar will transform to full M3 Navigation Drawer

═══════════════════════════════════════════════════════════════════════════════
*/
