import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
   selector: 'app-skill-breakdown',
   standalone: true,
   imports: [CommonModule],
   template: `
    <div class="flex flex-col items-center justify-center h-full">
       <div class="relative w-32 h-32">
          <!-- Simple CSS/SVG Circular Chart Representation -->
          <svg viewBox="0 0 36 36" class="w-full h-full transform -rotate-90">
             <!-- Ring 1: Hard Skills (Black) - 40% -->
             <path class="text-[var(--meribas-black)]" d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="40, 100" />
            
             <!-- Ring 2: Cognitive (Dark Gray) - 30% offset 40 -->
             <path class="text-neutral-600" d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="30, 100" stroke-dashoffset="-40" />

             <!-- Ring 3: Personality (Light Gray) - 30% offset 70 -->
             <path class="text-neutral-400" d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="30, 100" stroke-dashoffset="-70" />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
             <span class="text-xs font-bold text-gray-400">SKILLS</span>
          </div>
       </div>
       
       <div class="mt-4 w-full px-4 space-y-2">
          <div class="flex justify-between items-center text-xs">
             <div class="flex items-center"><span class="w-2 h-2 rounded-full bg-[var(--meribas-black)] mr-2"></span>Coding</div>
             <span class="font-bold">40%</span>
          </div>
          <div class="flex justify-between items-center text-xs">
             <div class="flex items-center"><span class="w-2 h-2 rounded-full bg-neutral-600 mr-2"></span>Cognitive</div>
             <span class="font-bold">30%</span>
          </div>
          <div class="flex justify-between items-center text-xs">
             <div class="flex items-center"><span class="w-2 h-2 rounded-full bg-neutral-400 mr-2"></span>Personality</div>
             <span class="font-bold">30%</span>
          </div>
       </div>
    </div>
  `,
   styles: []
})
export class SkillBreakdownComponent { }
