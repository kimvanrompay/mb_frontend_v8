import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FocusEvent {
  assessment_name: string;
  started_at: string;
  completed_at: string;
  duration_seconds: number;
  focus_quality: 'high' | 'medium' | 'low';
}

@Component({
  selector: 'app-mri-focus-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-3">
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-sm font-semibold text-gray-900">Focus Pattern</h4>
        <div *ngIf="overall_focus_score !== null" class="flex items-center gap-2">
          <span class="text-xs text-gray-600">Overall Focus:</span>
          <span [class]="'text-sm font-bold ' + getFocusScoreColor(overall_focus_score)">
            {{ overall_focus_score }}%
          </span>
        </div>
      </div>

      <div *ngIf="!timeline || timeline.length === 0" class="text-sm text-gray-500 italic text-center py-4">
        No behavioral data available yet.
      </div>

      <div class="space-y-2">
        <div *ngFor="let event of timeline" class="flex items-center gap-3">
          <!-- Focus Quality Indicator -->
          <div [class]="'w-3 h-3 rounded-full ' + getFocusQualityColor(event.focus_quality)"></div>
          
          <!-- Assessment Name & Duration -->
          <div class="flex-1">
            <div class="text-sm font-medium text-gray-900">{{ event.assessment_name }}</div>
            <div class="text-xs text-gray-500">
              Duration: {{ formatDuration(event.duration_seconds) }} 
              • {{ getFocusQualityLabel(event.focus_quality) }}
            </div>
          </div>

          <!-- Focus Bar -->
          <div class="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div [class]="'h-full ' + getFocusQualityBg(event.focus_quality)" 
                 [style.width.%]="getFocusWidthPercentage(event.focus_quality)">
            </div>
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span class="text-xs text-gray-600">High Focus</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-amber-500"></div>
          <span class="text-xs text-gray-600">Medium</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-red-500"></div>
          <span class="text-xs text-gray-600">Distracted</span>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class MriFocusTimelineComponent {
  @Input() timeline: FocusEvent[] = [];
  @Input() overall_focus_score: number | null = null;

  getFocusQualityColor(quality: string): string {
    switch (quality) {
      case 'high': return 'bg-emerald-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  }

  getFocusQualityBg(quality: string): string {
    switch (quality) {
      case 'high': return 'bg-emerald-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  }

  getFocusQualityLabel(quality: string): string {
    switch (quality) {
      case 'high': return 'Highly Focused';
      case 'medium': return 'Average Focus';
      case 'low': return 'Distracted';
      default: return 'Unknown';
    }
  }

  getFocusWidthPercentage(quality: string): number {
    switch (quality) {
      case 'high': return 100;
      case 'medium': return 60;
      case 'low': return 30;
      default: return 0;
    }
  }

  getFocusScoreColor(score: number): string {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  }

  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  }
}
