// DUAL-PANE NAVIGATION SYSTEM - FULLY DYNAMIC & COLLAPSIBLE
// Rail (80px) + Dynamic Drawer (280px)

import { Component, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

type NavCategory = 'home' | 'hiring' | 'library' | 'admin';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- DUAL-PANE CONTAINER (HOVER ACTIVATED) -->
    <!-- Usage: Flex container for Rail, but Drawer is Absolute Overlay -->
    <div class="flex h-full relative z-50" 
         (mouseenter)="onMouseEnter()" 
         (mouseleave)="onMouseLeave()">
      
      <!-- COLUMN 1: NAVIGATION RAIL (80px - Permanent) -->
      <nav class="w-[80px] h-full flex flex-col items-center py-4 bg-[#FDFDFD] border-r border-[#E0E2E5] z-30 shrink-0 relative bg-white">
        
        <!-- Search Button (Top Action) -->
        <a routerLink="/search" 
           class="w-12 h-12 rounded-[16px] bg-[#E8DEF8] hover:bg-[#D0BCFF] flex items-center justify-center mb-6 text-[#1D192B] transition-colors focus:outline-none cursor-pointer no-underline">
          <span class="material-icons text-[24px]">search</span>
        </a>
        
        <!-- Rail Item: Home -->
        <button (mouseenter)="onHoverRailItem('home')" (click)="setActiveCategory('home')" 
           [class.active-rail-item]="activeCategory === 'home'"
           class="flex flex-col items-center gap-1 mb-6 group w-full focus:outline-none cursor-pointer">
          <div class="w-14 h-8 rounded-[16px] flex items-center justify-center mb-1 transition-all"
               [ngClass]="activeCategory === 'home' ? 'bg-[#C4F5DA]' : 'group-hover:bg-[#E0E2E5]'">
            <span class="material-icons text-[24px]"
                  [ngClass]="activeCategory === 'home' ? 'text-[#052112]' : 'text-[#444746]'">dashboard</span>
          </div>
          <span class="text-[12px] font-medium"
                [ngClass]="activeCategory === 'home' ? 'font-bold text-[#1C1B1F]' : 'text-[#444746]'">Home</span>
        </button>

        <!-- Rail Item: Hiring -->
        <button (mouseenter)="onHoverRailItem('hiring')" (click)="setActiveCategory('hiring')" 
           [class.active-rail-item]="activeCategory === 'hiring'"
           class="flex flex-col items-center gap-1 mb-6 group w-full focus:outline-none cursor-pointer">
          <div class="w-14 h-8 rounded-[16px] flex items-center justify-center mb-1 transition-all"
               [ngClass]="activeCategory === 'hiring' ? 'bg-[#C4F5DA]' : 'group-hover:bg-[#E0E2E5]'">
            <span class="material-icons text-[24px]"
                  [ngClass]="activeCategory === 'hiring' ? 'text-[#052112]' : 'text-[#444746]'">work</span>
          </div>
          <span class="text-[12px] font-medium"
                [ngClass]="activeCategory === 'hiring' ? 'font-bold text-[#1C1B1F]' : 'text-[#444746]'">Hiring</span>
        </button>

        <!-- Rail Item: Library -->
        <button (mouseenter)="onHoverRailItem('library')" (click)="setActiveCategory('library')" 
           [class.active-rail-item]="activeCategory === 'library'"
           class="flex flex-col items-center gap-1 mb-6 group w-full focus:outline-none cursor-pointer">
          <div class="w-14 h-8 rounded-[16px] flex items-center justify-center mb-1 transition-all"
               [ngClass]="activeCategory === 'library' ? 'bg-[#C4F5DA]' : 'group-hover:bg-[#E0E2E5]'">
            <span class="material-icons text-[24px]"
                  [ngClass]="activeCategory === 'library' ? 'text-[#052112]' : 'text-[#444746]'">library_books</span>
          </div>
          <span class="text-[12px] font-medium"
                [ngClass]="activeCategory === 'library' ? 'font-bold text-[#1C1B1F]' : 'text-[#444746]'">Library</span>
        </button>
        
        <!-- Rail Item: Admin -->
        <button (mouseenter)="onHoverRailItem('admin')" (click)="setActiveCategory('admin')" 
           [class.active-rail-item]="activeCategory === 'admin'"
           class="flex flex-col items-center gap-1 mb-6 group w-full focus:outline-none cursor-pointer">
          <div class="w-14 h-8 rounded-[16px] flex items-center justify-center mb-1 transition-all"
               [ngClass]="activeCategory === 'admin' ? 'bg-[#C4F5DA]' : 'group-hover:bg-[#E0E2E5]'">
            <span class="material-icons text-[24px]"
                  [ngClass]="activeCategory === 'admin' ? 'text-[#052112]' : 'text-[#444746]'">settings</span>
          </div>
          <span class="text-[12px] font-medium"
                [ngClass]="activeCategory === 'admin' ? 'font-bold text-[#1C1B1F]' : 'text-[#444746]'">Admin</span>
        </button>

      </nav>

      <!-- COLUMN 2: CONTEXTUAL DRAWER (Absolute Overlay) -->
      <!-- Positioned absolute left-80px so it floats OVER main content instead of pushing it -->
      <aside class="absolute left-[80px] top-0 h-full bg-[#F3F4F6] border-r border-[#E0E2E5] shadow-2xl z-20 overflow-hidden transition-all duration-300 ease-in-out"
             [style.width.px]="isDrawerOpen ? 280 : 0"
             [style.opacity]="isDrawerOpen ? 1 : 0">
        
        <div class="w-[280px] h-full flex flex-col p-4"> <!-- Fixed width container -->

            <!-- DYNAMIC CONTENT SWITCHER -->
            <ng-container [ngSwitch]="activeCategory">
                <!-- ... content remains the same ... -->
                <!-- 1. HOME CATEGORY -->
                <ng-container *ngSwitchCase="'home'">
                    <div class="h-16 flex items-center px-4 mb-2">
                        <span class="text-[22px] font-normal text-[#1C1B1F]">Home</span>
                    </div>

                    <nav class="flex-1 flex flex-col gap-1">
                        <a routerLink="/dashboard" routerLinkActive="bg-[#E8DEF8] text-[#1D192B] font-bold" [routerLinkActiveOptions]="{exact: true}"
                           class="h-[56px] px-6 rounded-full hover:bg-[#E0E2E5] flex items-center gap-3 text-[#444746] font-medium text-[14px] transition-colors">
                            <span class="material-icons text-[20px]">dashboard</span>
                            <span>Dashboard</span>
                        </a>
                         <a routerLink="/notifications" routerLinkActive="bg-[#E8DEF8] text-[#1D192B] font-bold"
                           class="h-[56px] px-6 rounded-full hover:bg-[#E0E2E5] flex items-center gap-3 text-[#444746] font-medium text-[14px] transition-colors">
                            <span class="material-icons text-[20px]">notifications</span>
                            <span>Notifications</span>
                        </a>
                    </nav>
                </ng-container>

                <!-- 2. HIRING CATEGORY -->
                <ng-container *ngSwitchCase="'hiring'">
                    <div class="h-16 flex items-center px-4 mb-2">
                        <span class="text-[22px] font-normal text-[#1C1B1F]">Hiring</span>
                    </div>

                    <button class="h-14 w-full mb-6 rounded-[16px] bg-[#D1FAE5] hover:bg-[#A7F3D0] text-[#064E3B] font-semibold text-[14px] flex items-center justify-center gap-2 shadow-sm transition-all">
                        <span class="material-icons text-[20px]">add</span>
                        <span>New Position</span>
                    </button>

                    <nav class="flex-1 flex flex-col gap-1">
                        <div class="px-4 py-3 text-[11px] font-bold text-[#444746] uppercase tracking-wider">Management</div>
                        
                        <a routerLink="/jobs" routerLinkActive="bg-[#E8DEF8] text-[#1D192B] font-bold"
                           class="h-[56px] px-6 rounded-full hover:bg-[#E0E2E5] flex items-center gap-3 text-[#444746] font-medium text-[14px] transition-colors">
                            <span class="material-icons text-[20px]">work</span>
                            <span>Positions</span>
                        </a>
                        
                        <a routerLink="/candidates" routerLinkActive="bg-[#E8DEF8] text-[#1D192B] font-bold"
                           class="h-[56px] px-6 rounded-full hover:bg-[#E0E2E5] flex items-center gap-3 text-[#444746] font-medium text-[14px] transition-colors">
                            <span class="material-icons text-[20px]">people</span>
                            <span>Candidates</span>
                        </a>

                        <a routerLink="/invitations" routerLinkActive="bg-[#E8DEF8] text-[#1D192B] font-bold"
                           class="h-[56px] px-6 rounded-full hover:bg-[#E0E2E5] flex items-center gap-3 text-[#444746] font-medium text-[14px] transition-colors">
                            <span class="material-icons text-[20px]">mail</span>
                            <span>Invitations</span>
                        </a>
                    </nav>
                </ng-container>

                <!-- 3. LIBRARY CATEGORY -->
                <ng-container *ngSwitchCase="'library'">
                     <div class="h-16 flex items-center px-4 mb-2">
                        <span class="text-[22px] font-normal text-[#1C1B1F]">Library</span>
                    </div>

                    <nav class="flex-1 flex flex-col gap-1">
                        <a routerLink="/applications" routerLinkActive="bg-[#E8DEF8] text-[#1D192B] font-bold"
                           class="h-[56px] px-6 rounded-full hover:bg-[#E0E2E5] flex items-center gap-3 text-[#444746] font-medium text-[14px] transition-colors">
                            <span class="material-icons text-[20px]">assignment</span>
                            <span>Assessments</span>
                        </a>
                        
                        <a routerLink="/environment" routerLinkActive="bg-[#E8DEF8] text-[#1D192B] font-bold"
                           class="h-[56px] px-6 rounded-full hover:bg-[#E0E2E5] flex items-center gap-3 text-[#444746] font-medium text-[14px] transition-colors">
                            <span class="material-icons text-[20px]">science</span>
                            <span>Test Library</span>
                        </a>

                         <a routerLink="/deployments" routerLinkActive="bg-[#E8DEF8] text-[#1D192B] font-bold"
                           class="h-[56px] px-6 rounded-full hover:bg-[#E0E2E5] flex items-center gap-3 text-[#444746] font-medium text-[14px] transition-colors">
                            <span class="material-icons text-[20px]">calendar_month</span>
                            <span>Interview Scheduler</span>
                        </a>
                    </nav>
                </ng-container>

                <!-- 4. ADMIN CATEGORY -->
                <ng-container *ngSwitchCase="'admin'">
                     <div class="h-16 flex items-center px-4 mb-2">
                        <span class="text-[22px] font-normal text-[#1C1B1F]">Admin</span>
                    </div>

                    <nav class="flex-1 flex flex-col gap-1">
                         <a routerLink="/settings" routerLinkActive="bg-[#E8DEF8] text-[#1D192B] font-bold"
                           class="h-[56px] px-6 rounded-full hover:bg-[#E0E2E5] flex items-center gap-3 text-[#444746] font-medium text-[14px] transition-colors">
                            <span class="material-icons text-[20px]">settings</span>
                            <span>Settings</span>
                        </a>
                         <a routerLink="/team" routerLinkActive="bg-[#E8DEF8] text-[#1D192B] font-bold"
                           class="h-[56px] px-6 rounded-full hover:bg-[#E0E2E5] flex items-center gap-3 text-[#444746] font-medium text-[14px] transition-colors">
                            <span class="material-icons text-[20px]">groups</span>
                            <span>Team & Users</span>
                        </a>
                         <a routerLink="/billing" routerLinkActive="bg-[#E8DEF8] text-[#1D192B] font-bold"
                           class="h-[56px] px-6 rounded-full hover:bg-[#E0E2E5] flex items-center gap-3 text-[#444746] font-medium text-[14px] transition-colors">
                            <span class="material-icons text-[20px]">credit_card</span>
                            <span>Billing</span>
                        </a>
                    </nav>
                </ng-container>

            </ng-container>

            <!-- Bottom Section (Always Visible if Drawer Open) -->
             <div class="mt-auto pt-4 border-t border-[#E0E2E5]">
                 <!-- Trial Banner -->
                <div class="mb-3 px-4 py-3 bg-[#FDECEA] rounded-[12px]">
                    <div class="flex items-center justify-between mb-1">
                    <span class="text-[10px] font-bold text-[#B3261E] uppercase tracking-wide">Trial</span>
                    <span class="px-2 py-0.5 bg-[#B3261E] text-white text-[10px] font-bold rounded-full">14 days</span>
                    </div>
                    <p class="text-[11px] text-[#B3261E] leading-tight">Upgrade for features</p>
                </div>
             </div>

        </div>
      </aside>

    </div>
  `
})
export class SidebarComponent implements OnInit {
  isDrawerOpen = false; // Default closed
  activeCategory: NavCategory = 'home';

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.syncCategoryWithRoute();
    });
    this.syncCategoryWithRoute();
  }

  onMouseEnter() {
    this.isDrawerOpen = true;
  }

  onMouseLeave() {
    this.isDrawerOpen = false;
    // Reset to the actual active route category when closing
    // This ensures when they come back, it starts fresh or shows the correct context
    this.syncCategoryWithRoute(); 
  }

  // New method: Updates category on hover + ensures drawer is open
  onHoverRailItem(category: NavCategory) {
    this.activeCategory = category;
    this.isDrawerOpen = true;
  }

  setActiveCategory(category: NavCategory) {
    this.activeCategory = category;
  }

  private syncCategoryWithRoute() {
    const url = this.router.url;
    if (url.includes('/dashboard')) this.activeCategory = 'home';
    else if (url.includes('/jobs') || url.includes('/candidates') || url.includes('/invitations')) this.activeCategory = 'hiring';
    else if (url.includes('/applications') || url.includes('/environment') || url.includes('/deployments')) this.activeCategory = 'library';
    else if (url.includes('/settings') || url.includes('/team') || url.includes('/billing')) this.activeCategory = 'admin';
  }
}
