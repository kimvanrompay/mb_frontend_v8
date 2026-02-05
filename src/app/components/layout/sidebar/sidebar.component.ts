// M3 NAVIGATION RAIL - COMPACT VERTICAL NAVIGATION
// Inspired by Material Design documentation site

import { Component, ElementRef } from '@angular/core';
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
    <!-- M3 Navigation Rail (Compact: 80px) -->
    <div class="flex flex-col items-center w-[80px] h-full bg-[#F5F5F5] py-4">
      
      <!-- Search Icon (First Position) -->
      <button class="w-14 h-14 rounded-2xl bg-[#E1CCEC] hover:bg-[#D4BFDE] 
                     flex items-center justify-center mb-6 transition-colors
                     focus:outline-none focus:ring-2 focus:ring-primary/50">
        <span class="material-icons text-[24px] text-[#4A4A4A]">search</span>
      </button>

      <!-- Navigation Rail Items -->
      <nav class="flex-1 flex flex-col items-center gap-3 overflow-y-auto">
        
        <!-- Home -->
        <a routerLink="/dashboard" 
           routerLinkActive="bg-white"
           [routerLinkActiveOptions]="{exact: true}"
           class="w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1
                  hover:bg-[#E5E7EB] transition-colors
                  focus:outline-none focus:ring-2 focus:ring-primary/50"
           tabindex="0">
          <span class="material-icons text-[20px] text-[#4A4A4A]">home</span>
          <span class="text-[10px] text-[#4A4A4A] font-medium">Home</span>
        </a>

        <!-- Get Started -->
        <a routerLink="/jobs" 
           routerLinkActive="bg-white"
           class="w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1
                  hover:bg-[#E5E7EB] transition-colors
                  focus:outline-none focus:ring-2 focus:ring-primary/50"
           tabindex="0">
          <span class="material-icons text-[20px] text-[#4A4A4A]">apps</span>
          <span class="text-[10px] text-[#4A4A4A] font-medium text-center leading-tight">Get started</span>
        </a>

        <!-- Develop -->
        <a routerLink="/applications" 
           routerLinkActive="bg-white"
           class="w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1
                  hover:bg-[#E5E7EB] transition-colors
                  focus:outline-none focus:ring-2 focus:ring-primary/50"
           tabindex="0">
          <span class="material-icons text-[20px] text-[#4A4A4A]">code</span>
          <span class="text-[10px] text-[#4A4A4A] font-medium">Develop</span>
        </a>

        <!-- Foundations -->
        <a routerLink="/candidates" 
           routerLinkActive="bg-white"
           class="w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1
                  hover:bg-[#E5E7EB] transition-colors
                  focus:outline-none focus:ring-2 focus:ring-primary/50"
           tabindex="0">
          <span class="material-icons text-[20px] text-[#4A4A4A]">book</span>
          <span class="text-[10px] text-[#4A4A4A] font-medium text-center leading-tight">Foundations</span>
        </a>

        <!-- Styles -->
        <a routerLink="/invitations" 
           routerLinkActive="bg-white"
           class="w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1
                  hover:bg-[#E5E7EB] transition-colors
                  focus:outline-none focus:ring-2 focus:ring-primary/50"
           tabindex="0">
          <span class="material-icons text-[20px] text-[#4A4A4A]">palette</span>
          <span class="text-[10px] text-[#4A4A4A] font-medium">Styles</span>
        </a>

      </nav>

      <!-- Bottom spacer -->
      <div class="h-4"></div>

    </div>
  `
})
export class SidebarComponent {
  constructor(private elementRef: ElementRef) {}

  onKeyDown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    
    if (!target.matches('a[tabindex="0"], button')) return;

    const navItems = Array.from(
      this.elementRef.nativeElement.querySelectorAll('a[tabindex="0"], button')
    ) as HTMLElement[];
    
    const currentIndex = navItems.indexOf(target);
    if (currentIndex === -1) return;

    let nextIndex: number | null = null;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        nextIndex = currentIndex < navItems.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'ArrowUp':
        event.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : navItems.length - 1;
        break;
    }

    if (nextIndex !== null) {
      navItems[nextIndex].focus();
    }
  }
}
