import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gauge-trust',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center h-full">
      <!-- Simple SVG Half-Donut Gauge -->
      <div class="relative w-40 h-24 overflow-hidden">
         <svg viewBox="0 0 100 50" class="w-full h-full">
            <!-- Background Arc -->
            <path d="M10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#E5E7EB" stroke-width="12" />
            <!-- Value Arc (Black) -->
            <path d="M10 50 A 40 40 0 0 1 90 50" fill="none" class="text-[var(--meribas-black)]" stroke="currentColor" 
                  stroke-width="12" [attr.stroke-dasharray]="dashArray" stroke-dashoffset="0" />
         </svg>
         <div class="absolute bottom-0 left-0 w-full text-center">
            <span class="text-2xl font-bold text-[var(--meribas-black)]">{{ score }}%</span>
         </div>
      </div>
      <p class="mt-2 text-sm font-medium text-gray-500">{{ label }}</p>
    </div>
  `,
  styles: []
})
export class GaugeTrustComponent {
  @Input() score: number = 98;
  @Input() label: string = 'Integrity Score';

  // Calculate generic dash array for demo (full arc is ~125 units long)
  // For simplicity, we just show full green for high scores
  get dashArray(): string {
    // A simplified version, hardcoded for visual 'full' effect for now
    const percentage = this.score / 100;
    const arcLength = 126; // approx length of r=40 pi
    return `${arcLength * percentage} ${arcLength}`;
  }
}
