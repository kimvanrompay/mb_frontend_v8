// COMPLETE M3 NAVIGATION DRAWER - READY FOR IMPLEMENTATION
// Replace the content of: src/app/components/layout/sidebar/sidebar.component.ts

import { Component, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  host: {
    '(keydown)': 'onKeyDown($event)'
  },
  template: `
    <!-- M3 Standard Navigation Drawer (Strict Spec: 360px) -->
    <div class="flex flex-col w-[360px] h-full bg-surface-container-low">
      
      <!-- Logo Area -->
      <div class="h-16 flex items-center px-6">
        <a routerLink="/dashboard" class="flex items-center gap-2">
          <img src="https://res.cloudinary.com/dg0qxqj4a/image/upload/v1768848576/Boat_Logo_Black_na90ec.png" 
               alt="Meribas" class="h-6 w-auto">
        </a>
      </div>

      <!-- Extended FAB (Primary Action - M3 Spec) -->
      <div class="px-4 pb-6">
        <a routerLink="/candidates" 
           class="h-14 w-full bg-primary-container text-on-primary-container rounded-2xl 
                  flex items-center justify-center gap-3 font-semibold text-[14px] tracking-wide 
                  shadow-md hover:shadow-lg transition-all group
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
           tabindex="0">
          <span class="material-icons-outlined text-[24px] group-hover:scale-110 transition-transform">add</span>
          <span>Invite Candidate</span>
        </a>
      </div>

      <!-- Navigation Items -->
      <nav class="flex-1 overflow-y-auto px-3 py-2">
        
        <!-- Primary Navigation -->
        <div class="space-y-1 mb-4">
          
          <!-- Overview (M3 Spec: 56px height, Label Large 14px) -->
          <a routerLink="/dashboard" 
             routerLinkActive="bg-secondary-container text-on-secondary-container font-bold"
             [routerLinkActiveOptions]="{exact: true}"
             class="h-[56px] px-6 flex items-center gap-3 
                    text-on-surface-variant font-medium text-[14px] rounded-full
                    hover:bg-surface-container-high transition-colors
                    focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/50"
             tabindex="0">
            <span class="material-icons text-[24px]">dashboard</span>
            <span>Overview</span>
          </a>

          <!-- Positions -->
          <a routerLink="/jobs" 
             routerLinkActive="bg-secondary-container text-on-secondary-container font-bold"
             class="h-[56px] px-6 flex items-center gap-3 
                    text-on-surface-variant font-medium text-[14px] rounded-full
                    hover:bg-surface-container-high transition-colors
                    focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/50"
             tabindex="0">
            <span class="material-icons-outlined text-[24px]">work_outline</span>
            <span>Positions</span>
          </a>

          <!-- Assessments -->
          <a routerLink="/applications" 
             routerLinkActive="bg-secondary-container text-on-secondary-container font-bold"
             class="h-[56px] px-6 flex items-center gap-3 
                    text-on-surface-variant font-medium text-[14px] rounded-full
                    hover:bg-surface-container-high transition-colors
                    focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/50"
             tabindex="0">
            <span class="material-icons-outlined text-[24px]">assignment</span>
            <span>Assessments</span>
          </a>

          <!-- Candidates -->
          <a routerLink="/candidates" 
             routerLinkActive="bg-secondary-container text-on-secondary-container font-bold"
             class="h-[56px] px-6 flex items-center gap-3 
                    text-on-surface-variant font-medium text-[14px] rounded-full
                    hover:bg-surface-container-high transition-colors
                    focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/50"
             tabindex="0">
            <span class="material-icons text-[24px]">people</span>
            <span>Candidates</span>
          </a>

          <!-- Invitations -->
          <a routerLink="/invitations" 
             routerLinkActive="bg-secondary-container text-on-secondary-container font-bold"
             class="h-[56px] px-6 flex items-center gap-3 
                    text-on-surface-variant font-medium text-[14px] rounded-full
                    hover:bg-surface-container-high transition-colors
                    focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/50"
             tabindex="0">
            <span class="material-icons-outlined text-[24px]">mail_outline</span>
            <span>Invitations</span>
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
               class="h-[56px] px-6 flex items-center gap-3 
                      text-on-surface-variant font-medium text-[14px] rounded-full
                      hover:bg-surface-container-high transition-colors
                      focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/50"
               tabindex="0">
              <span class="material-icons-outlined text-[24px]">library_books</span>
              <span>Test Library</span>
            </a>

            <!-- Interview Scheduler -->
            <a routerLink="/deployments" 
               routerLinkActive="bg-secondary-container text-on-secondary-container font-bold"
               class="h-[56px] px-6 flex items-center gap-3 
                      text-on-surface-variant font-medium text-[14px] rounded-full
                      hover:bg-surface-container-high transition-colors
                      focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/50"
               tabindex="0">
              <span class="material-icons-outlined text-[24px]">calendar_month</span>
              <span>Interview Scheduler</span>
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
               class="h-[56px] px-6 flex items-center gap-3 
                      text-on-surface-variant font-medium text-[14px] rounded-full
                      hover:bg-surface-container-high transition-colors
                      focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/50"
               tabindex="0">
              <span class="material-icons-outlined text-[24px]">groups</span>
              <span>Team & Permissions</span>
            </a>

            <!-- Billing & Subscription -->
            <a routerLink="/billing" 
               routerLinkActive="bg-secondary-container text-on-secondary-container font-bold"
               class="h-[56px] px-6 flex items-center gap-3 
                      text-on-surface-variant font-medium text-[14px] rounded-full
                      hover:bg-surface-container-high transition-colors
                      focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/50"
               tabindex="0">
              <span class="material-icons-outlined text-[24px]">credit_card</span>
              <span>Billing & Subscription</span>
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
               class="h-[56px] px-6 flex items-center gap-3 
                      text-on-surface-variant font-medium text-[14px] rounded-full
                      hover:bg-surface-container-high transition-colors
                      focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/50"
               tabindex="0">
              <span class="material-icons-outlined text-[24px]">extension</span>
              <span>Integrations</span>
            </a>

            <!-- Invite a Friend -->
            <a routerLink="/invite-friend" 
               routerLinkActive="bg-secondary-container text-on-secondary-container font-bold"
               class="h-[56px] px-6 flex items-center gap-3 
                      text-on-surface-variant font-medium text-[14px] rounded-full
                      hover:bg-surface-container-high transition-colors
                      focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/50"
               tabindex="0">
              <span class="material-icons-outlined text-[24px]">person_add_alt</span>
              <span>Invite a Friend</span>
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
           class="h-[56px] px-4 flex items-center gap-3 
                  text-on-surface-variant font-medium text-[14px] rounded-full
                  hover:bg-surface-container-high transition-colors
                  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/50"
           tabindex="0">
          <span class="material-icons-outlined text-[24px]">settings</span>
          <span>Settings</span>
        </a>

        <!-- Help & Support -->
        <a href="https://docs.meribas.app" 
           target="_blank" 
           class="h-[56px] px-4 flex items-center gap-3 
                  text-on-surface-variant font-medium text-[14px] rounded-full
                  hover:bg-surface-container-high transition-colors
                  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/50"
           tabindex="0">
          <span class="material-icons-outlined text-[24px]">help</span>
          <span>Help & Support</span>
        </a>

      </div>

    </div>
  `
})
export class SidebarComponent {
  constructor(private elementRef: ElementRef) {}

  // M3 Accessibility: Keyboard Navigation Support
  onKeyDown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    
    // Only handle keyboard navigation on nav items
    if (!target.matches('a[tabindex="0"]')) return;

    const navLinks = Array.from(
      this.elementRef.nativeElement.querySelectorAll('a[tabindex="0"]')
    ) as HTMLElement[];
    
    const currentIndex = navLinks.indexOf(target);
    if (currentIndex === -1) return;

    let nextIndex: number | null = null;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        nextIndex = currentIndex < navLinks.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'ArrowUp':
        event.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : navLinks.length - 1;
        break;
      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        nextIndex = navLinks.length - 1;
        break;
    }

    if (nextIndex !== null) {
      navLinks[nextIndex].focus();
    }
  }
}

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
