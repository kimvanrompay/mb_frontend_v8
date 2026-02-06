// DUAL-PANE NAVIGATION SYSTEM - FULLY DYNAMIC & COLLAPSIBLE
// Rail (80px) + Dynamic Drawer (280px)

import { Component, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService, User } from '../../../services/auth';

type NavCategory = 'home' | 'hiring' | 'library' | 'admin';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- DUAL-PANE CONTAINER (HOVER ACTIVATED) -->
    <!-- Usage: Flex container for Rail, but Drawer is Absolute Overlay -->
    <div class="flex h-full relative z-50" 
         (mouseleave)="onMouseLeave()">
      
      <!-- COLUMN 1: NAVIGATION RAIL (80px - Permanent) -->
      <nav class="w-[72px] h-full flex flex-col items-center py-4 bg-[#0F5132] border-r border-[#0B3D26] z-30 shrink-0 relative">
        
        <!-- Search Button (Top Action - HOVER CLOSES DRAWER) -->
        <a routerLink="/search" 
           (mouseenter)="onMouseLeave()"
           class="w-10 h-10 rounded-[12px] bg-white/10 hover:bg-white/20 flex items-center justify-center mb-6 text-white transition-colors focus:outline-none cursor-pointer no-underline">
          <span class="material-icons text-[20px]">search</span>
        </a>
        
        <!-- Rail Items Container (HOVER OPENS DRAWER) -->
        <div class="flex flex-col items-center w-full" (mouseenter)="onMouseEnter()">
        <button (mouseenter)="onHoverRailItem('home')" (click)="setActiveCategory('home')" 
           [class.active-rail-item]="activeCategory === 'home'"
           class="flex flex-col items-center gap-1 mb-6 group w-full focus:outline-none cursor-pointer">
          <div class="w-12 h-7 rounded-[12px] flex items-center justify-center mb-1 transition-all"
               [ngClass]="activeCategory === 'home' ? 'bg-white text-[#0F5132]' : 'group-hover:bg-white/10 text-white/70'">
            <span class="material-icons text-[20px]">dashboard</span>
          </div>
          <span class="text-[10px] font-medium transition-colors"
                [ngClass]="activeCategory === 'home' ? 'font-bold text-white' : 'text-white/70'">Home</span>
        </button>

        <!-- Rail Item: Hiring -->
        <button (mouseenter)="onHoverRailItem('hiring')" (click)="setActiveCategory('hiring')" 
           [class.active-rail-item]="activeCategory === 'hiring'"
           class="flex flex-col items-center gap-1 mb-6 group w-full focus:outline-none cursor-pointer">
          <div class="w-12 h-7 rounded-[12px] flex items-center justify-center mb-1 transition-all"
               [ngClass]="activeCategory === 'hiring' ? 'bg-white text-[#0F5132]' : 'group-hover:bg-white/10 text-white/70'">
            <span class="material-icons text-[20px]">work</span>
          </div>
          <span class="text-[10px] font-medium transition-colors"
                [ngClass]="activeCategory === 'hiring' ? 'font-bold text-white' : 'text-white/70'">Hiring</span>
        </button>

        <!-- Rail Item: Library -->
        <button (mouseenter)="onHoverRailItem('library')" (click)="setActiveCategory('library')" 
           [class.active-rail-item]="activeCategory === 'library'"
           class="flex flex-col items-center gap-1 mb-6 group w-full focus:outline-none cursor-pointer">
          <div class="w-12 h-7 rounded-[12px] flex items-center justify-center mb-1 transition-all"
               [ngClass]="activeCategory === 'library' ? 'bg-white text-[#0F5132]' : 'group-hover:bg-white/10 text-white/70'">
            <span class="material-icons text-[20px]">library_books</span>
          </div>
          <span class="text-[10px] font-medium transition-colors"
                [ngClass]="activeCategory === 'library' ? 'font-bold text-white' : 'text-white/70'">Library</span>
        </button>
        
        <!-- Rail Item: Admin -->
        <button (mouseenter)="onHoverRailItem('admin')" (click)="setActiveCategory('admin')" 
           [class.active-rail-item]="activeCategory === 'admin'"
           class="flex flex-col items-center gap-1 mb-6 group w-full focus:outline-none cursor-pointer">
          <div class="w-12 h-7 rounded-[12px] flex items-center justify-center mb-1 transition-all"
               [ngClass]="activeCategory === 'admin' ? 'bg-white text-[#0F5132]' : 'group-hover:bg-white/10 text-white/70'">
            <span class="material-icons text-[20px]">settings</span>
          </div>
          <span class="text-[10px] font-medium transition-colors"
                [ngClass]="activeCategory === 'admin' ? 'font-bold text-white' : 'text-white/70'">Admin</span>
        </button>

        </div>

        <!-- USER ANCHOR (The "CEO" Position) -->
        <div class="mt-auto mb-4 w-full flex justify-center relative group">
          <button class="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 hover:border-white transition-all focus:outline-none cursor-pointer" id="user-menu-trigger">
            <img src="https://i.pravatar.cc/150?u=alice" alt="Profile" class="w-full h-full object-cover">
          </button>

          <!-- THE M3 PANEL (Explodes on Hover) -->
          <div class="absolute left-[70px] bottom-0 w-[280px] bg-[#FDFDFD] rounded-[16px] shadow-lg border border-[#E0E2E5] flex flex-col overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 origin-bottom-left">
            
            <!-- Header with Metadata -->
            <div class="px-4 py-4 bg-[#F3F4F6] border-b border-[#E0E2E5]" *ngIf="user$ | async as user">
              <div class="text-[14px] font-bold text-[#1C1B1F]">{{ user.full_name || user.first_name + ' ' + user.last_name }}</div>
              <div class="text-[11px] text-[#444746] mt-1">{{ user.email }}</div>
              
              <div class="mt-3 flex flex-col gap-1">
                 <div class="flex justify-between text-[10px] uppercase tracking-wider text-[#444746] font-bold">
                   <span>User ID:</span> <span class="font-mono">{{ user.id }}</span>
                 </div>
                 <div class="flex justify-between text-[10px] uppercase tracking-wider text-[#444746] font-bold">
                   <span>Tenant:</span> <span class="font-mono">{{ user.tenant.name }}</span>
                 </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="p-2 flex flex-col gap-1">
              <a href="javascript:void(0)" class="h-10 px-4 rounded-lg hover:bg-[#E0E2E5] flex items-center gap-3 text-[#1C1B1F] text-[14px] font-medium transition-colors no-underline">
                <span class="material-icons text-[20px]">account_circle</span>
                Profile Settings
              </a>
              <a href="javascript:void(0)" class="h-10 px-4 rounded-lg hover:bg-[#E0E2E5] flex items-center gap-3 text-[#1C1B1F] text-[14px] font-medium transition-colors no-underline">
                <span class="material-icons text-[20px]">group_add</span>
                Tenant Switcher
              </a>
              
              <div class="my-1 border-t border-[#E0E2E5]"></div>
              
              <a href="javascript:void(0)" (click)="logout()" class="h-10 px-4 rounded-lg hover:bg-[#FFDAD6] text-[#410002] flex items-center gap-3 font-medium text-[14px] transition-colors no-underline">
                <span class="material-icons text-[20px]">logout</span>
                Log Out
              </a>
            </div>
          </div>
        </div>
      </nav>

      <!-- COLUMN 2: CONTEXTUAL DRAWER (Absolute Overlay) -->
      <!-- Positioned absolute left-72px so it floats OVER main content instead of pushing it -->
      <aside class="absolute left-[72px] top-0 h-full bg-white border-r border-[#E0E2E5] shadow-2xl z-20 overflow-hidden transition-all duration-300 ease-in-out"
             [style.width.px]="isDrawerOpen ? 240 : 0"
             [style.opacity]="isDrawerOpen ? 1 : 0">
        
        <div class="w-[240px] h-full flex flex-col p-3"> <!-- Fixed width container -->

            <!-- DYNAMIC CONTENT SWITCHER -->
            <ng-container [ngSwitch]="activeCategory">
                <!-- ... content remains the same ... -->
                <!-- 1. HOME CATEGORY -->
                <ng-container *ngSwitchCase="'home'">
                    <div class="h-12 flex items-center px-3 mb-1">
                        <span class="text-[18px] font-medium text-[#1C1B1F]">Home</span>
                    </div>

                    <nav class="flex-1 flex flex-col gap-1">
                        <a routerLink="/dashboard" routerLinkActive="bg-[#D1FAE5] text-[#064E3B] font-bold" [routerLinkActiveOptions]="{exact: true}"
                           class="h-[40px] px-4 rounded-full hover:bg-[#F3F4F6] flex items-center gap-3 text-[#444746] font-medium text-[13px] transition-colors">
                            <span>Dashboard</span>
                        </a>
                         <a routerLink="/notifications" routerLinkActive="bg-[#D1FAE5] text-[#064E3B] font-bold"
                           class="h-[40px] px-4 rounded-full hover:bg-[#F3F4F6] flex items-center gap-3 text-[#444746] font-medium text-[13px] transition-colors">
                            <span>Notifications</span>
                        </a>
                    </nav>
                <!-- 2. HIRING CATEGORY -->
                <ng-container *ngSwitchCase="'hiring'">
                    <div class="h-12 flex items-center px-3 mb-1">
                        <span class="text-[18px] font-medium text-[#1C1B1F]">Hiring</span>
                    </div>

                    <button class="h-10 w-full mb-4 rounded-[12px] bg-[#D1FAE5] hover:bg-[#A7F3D0] text-[#064E3B] font-semibold text-[13px] flex items-center justify-center gap-2 shadow-sm transition-all">
                        <span class="material-icons text-[18px]">add</span>
                        <span>New Position</span>
                    </button>

                    <nav class="flex-1 flex flex-col gap-1">
                        <div class="px-4 py-2 text-[10px] font-bold text-[#444746] uppercase tracking-wider">Management</div>
                        
                        <a routerLink="/jobs" routerLinkActive="bg-[#D1FAE5] text-[#064E3B] font-bold"
                           class="h-[40px] px-4 rounded-full hover:bg-[#F3F4F6] flex items-center gap-3 text-[#444746] font-medium text-[13px] transition-colors">
                            <span>Positions</span>
                        </a>
                        
                        <a routerLink="/candidates" routerLinkActive="bg-[#D1FAE5] text-[#064E3B] font-bold"
                           class="h-[40px] px-4 rounded-full hover:bg-[#F3F4F6] flex items-center gap-3 text-[#444746] font-medium text-[13px] transition-colors">
                            <span>Candidates</span>
                        </a>

                        <a routerLink="/invitations" routerLinkActive="bg-[#D1FAE5] text-[#064E3B] font-bold"
                           class="h-[40px] px-4 rounded-full hover:bg-[#F3F4F6] flex items-center gap-3 text-[#444746] font-medium text-[13px] transition-colors">
                            <span>Invitations</span>
                        </a>
                    </nav>
                </ng-container>

                <!-- 3. LIBRARY CATEGORY -->
                <ng-container *ngSwitchCase="'library'">
                     <div class="h-12 flex items-center px-3 mb-1">
                        <span class="text-[18px] font-medium text-[#1C1B1F]">Library</span>
                    </div>

                    <nav class="flex-1 flex flex-col gap-1">
                        <a routerLink="/applications" routerLinkActive="bg-[#D1FAE5] text-[#064E3B] font-bold"
                           class="h-[40px] px-4 rounded-full hover:bg-[#F3F4F6] flex items-center gap-3 text-[#444746] font-medium text-[13px] transition-colors">
                            <span>Assessments</span>
                        </a>
                        
                        <a routerLink="/environment" routerLinkActive="bg-[#D1FAE5] text-[#064E3B] font-bold"
                           class="h-[40px] px-4 rounded-full hover:bg-[#F3F4F6] flex items-center gap-3 text-[#444746] font-medium text-[13px] transition-colors">
                            <span>Test Library</span>
                        </a>

                         <a routerLink="/deployments" routerLinkActive="bg-[#D1FAE5] text-[#064E3B] font-bold"
                           class="h-[40px] px-4 rounded-full hover:bg-[#F3F4F6] flex items-center gap-3 text-[#444746] font-medium text-[13px] transition-colors">
                            <span>Interview Scheduler</span>
                        </a>
                    </nav>
                </ng-container>

                <!-- 4. ADMIN CATEGORY -->
                <ng-container *ngSwitchCase="'admin'">
                     <div class="h-12 flex items-center px-3 mb-1">
                        <span class="text-[18px] font-medium text-[#1C1B1F]">Admin</span>
                    </div>

                    <nav class="flex-1 flex flex-col gap-1">
                         <a routerLink="/settings" routerLinkActive="bg-[#D1FAE5] text-[#064E3B] font-bold"
                           class="h-[40px] px-4 rounded-full hover:bg-[#F3F4F6] flex items-center gap-3 text-[#444746] font-medium text-[13px] transition-colors">
                            <span>Settings</span>
                        </a>
                         <a routerLink="/team" routerLinkActive="bg-[#D1FAE5] text-[#064E3B] font-bold"
                           class="h-[40px] px-4 rounded-full hover:bg-[#F3F4F6] flex items-center gap-3 text-[#444746] font-medium text-[13px] transition-colors">
                            <span>Team & Users</span>
                        </a>
                         <a routerLink="/billing" routerLinkActive="bg-[#D1FAE5] text-[#064E3B] font-bold"
                           class="h-[40px] px-4 rounded-full hover:bg-[#F3F4F6] flex items-center gap-3 text-[#444746] font-medium text-[13px] transition-colors">
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
  user$: Observable<User | null>;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.user$ = this.authService.currentUser$;
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.syncCategoryWithRoute();
    });
    this.syncCategoryWithRoute();
  }

  logout() {
    this.authService.logout();
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
