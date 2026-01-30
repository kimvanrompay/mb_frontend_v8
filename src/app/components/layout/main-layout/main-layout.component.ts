import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarCenteredComponent } from '../navbar-centered/navbar-centered.component';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, SidebarComponent, NavbarCenteredComponent],
    template: `
    <div class="flex h-screen bg-white">
      <!-- Fixed Sidebar -->
      <app-sidebar class="hidden md:block"></app-sidebar>

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col h-full overflow-hidden relative">
         <!-- Context Nav (Top Bar) -->
         <app-navbar-centered></app-navbar-centered>

         <!-- Page Content -->
         <main class="flex-1 overflow-auto bg-gray-50/50 p-4 md:p-8">
            <div class="mx-auto max-w-7xl">
               <router-outlet></router-outlet>
            </div>
         </main>
      </div>
    </div>
  `
})
export class MainLayoutComponent { }
