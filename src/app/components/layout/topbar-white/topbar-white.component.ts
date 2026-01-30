import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-topbar-white',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8">
      <div class="flex flex-1 items-center">
        <!-- Search -->
        <div class="relative w-full max-w-lg">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
            </svg>
          </div>
          <input type="text" class="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[var(--meribas-black)] sm:text-sm sm:leading-6" placeholder="Search candidates, tests...">
        </div>
      </div>

      <div class="ml-4 flex items-center space-x-4">
        <button class="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500">
           <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
           </svg>
        </button>
      </div>
    </div>
  `,
    styles: []
})
export class TopbarWhiteComponent { }
