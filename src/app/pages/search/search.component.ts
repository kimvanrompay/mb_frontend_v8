import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-[800px] mx-auto pt-8">
      
      <!-- Large Search Input -->
      <div class="relative mb-12">
        <input type="text" 
               placeholder="Search" 
               class="w-full h-[72px] pl-16 pr-6 rounded-full bg-[#F3F4F6] text-[22px] text-[#1C1B1F] placeholder:text-[#444746] focus:outline-none focus:ring-2 focus:ring-[#6750A4] transition-all shadow-sm"
               autofocus>
        <span class="material-icons absolute left-6 top-1/2 -translate-y-1/2 text-[28px] text-[#1C1B1F]">search</span>
      </div>

      <!-- Recent Searches -->
      <div class="px-4">
        <h3 class="text-[14px] font-medium text-[#1C1B1F] mb-4">Recent searches</h3>
        
        <div class="space-y-1">
          <!-- History Item 1 -->
          <button class="w-full h-[56px] flex items-center gap-4 px-4 -mx-4 rounded-full hover:bg-[#F3F4F6] transition-colors group text-left">
            <span class="material-icons text-[#444746] group-hover:text-[#1C1B1F]">history</span>
            <span class="text-[16px] text-[#1C1B1F]">tables</span>
          </button>

          <!-- History Item 2 (Mock) -->
          <button class="w-full h-[56px] flex items-center gap-4 px-4 -mx-4 rounded-full hover:bg-[#F3F4F6] transition-colors group text-left">
            <span class="material-icons text-[#444746] group-hover:text-[#1C1B1F]">history</span>
            <span class="text-[16px] text-[#1C1B1F]">candidates 2024</span>
          </button>
        </div>
      </div>

    </div>
  `
})
export class SearchComponent { }
