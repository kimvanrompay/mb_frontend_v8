import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mri-gauge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative flex items-center justify-center">
      <!-- SVG Gauge -->
      <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 200 200" class="transform -rotate-90">
        <!-- Background Circle -->
        <circle
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke="#E5E7EB"
          stroke-width="12"
        />
        <!-- Progress Circle -->
        <circle
          cx="100"
          cy="100"
          r="85"
          fill="none"
          [attr.stroke]="getColor()"
          stroke-width="12"
          stroke-linecap="round"
          [attr.stroke-dasharray]="circumference"
          [attr.stroke-dashoffset]="dashOffset"
          class="transition-all duration-1000 ease-out"
        />
      </svg>

      <!-- Center Text -->
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <div class="text-4xl font-bold" [style.color]="getColor()">
          {{ score ?? '—' }}<span class="text-2xl">%</span>
        </div>
        <div class="text-sm text-gray-500 mt-1">{{ label }}</div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class MriGaugeComponent implements OnChanges {
  @Input() score: number | null = null;
  @Input() label: string = 'Overall Match';
  @Input() size: number = 200;

  circumference = 2 * Math.PI * 85; // radius = 85
  dashOffset = this.circumference;

  ngOnChanges() {
    if (this.score !== null) {
      // Calculate dash offset for percentage
      const progress = (this.score / 100) * this.circumference;
      this.dashOffset = this.circumference - progress;
    }
  }

  getColor(): string {
    if (this.score === null) return '#9CA3AF';
    if (this.score >= 85) return '#10B981'; // Green - Excellent
    if (this.score >= 75) return '#3B82F6'; // Blue - Strong
    if (this.score >= 60) return '#F59E0B'; // Amber - Average
    return '#EF4444'; // Red - Weak
  }
}
