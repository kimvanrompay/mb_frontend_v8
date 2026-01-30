import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DayActivity {
  date: Date;
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // Activity levels like GitHub
}

@Component({
  selector: 'app-activity-heatmap',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-500 font-mono">{{ totalActivities }} assessments in the last year</span>
        </div>
        <div class="flex items-center gap-2 text-[10px] text-gray-400">
          <span>Less</span>
          <div class="flex gap-1">
            <div class="w-3 h-3 bg-green-50 border border-green-100 rounded-sm"></div>
            <div class="w-3 h-3 bg-green-100 border border-green-200 rounded-sm"></div>
            <div class="w-3 h-3 bg-green-300 border border-green-400 rounded-sm"></div>
            <div class="w-3 h-3 bg-green-500 border border-green-600 rounded-sm"></div>
            <div class="w-3 h-3 bg-green-700 border border-green-800 rounded-sm"></div>
          </div>
          <span>More</span>
        </div>
      </div>

      <!-- Heatmap Grid -->
      <div class="flex gap-1 overflow-x-auto pb-2">
        <!-- Month Labels (vertical) -->
        <div class="flex flex-col justify-around text-[9px] text-gray-400 font-mono pr-2 pt-4">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>

        <!-- Weeks Grid -->
        <div class="flex gap-1">
          <div *ngFor="let week of weeks" class="flex flex-col gap-1">
            <div 
              *ngFor="let day of week"
              [title]="getTooltip(day)"
              class="w-3 h-3 rounded-sm border cursor-pointer transition-all hover:ring-2 hover:ring-black hover:ring-offset-1"
              [ngClass]="getColorClass(day)"
            ></div>
          </div>
        </div>
      </div>

      <!-- Busiest Day Info -->
      <div class="mt-3 pt-3 border-t border-gray-100">
        <div class="flex items-center justify-between text-xs">
          <span class="text-gray-500 font-mono">Busiest day:</span>
          <span class="font-medium text-black">{{ busiestDay.count }} assessments on {{ formatDate(busiestDay.date) }}</span>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ActivityHeatmapComponent {
  weeks: DayActivity[][] = [];
  totalActivities = 0;
  busiestDay: DayActivity = { date: new Date(), count: 0, level: 0 };

  ngOnInit() {
    this.generateHeatmapData();
  }

  private generateHeatmapData(): void {
    const weeks: DayActivity[][] = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364); // Last 52 weeks

    // Start from the first Sunday
    while (startDate.getDay() !== 0) {
      startDate.setDate(startDate.getDate() - 1);
    }

    let currentWeek: DayActivity[] = [];
    let currentDate = new Date(startDate);
    let maxCount = 0;

    // Generate 52 weeks
    for (let week = 0; week < 52; week++) {
      currentWeek = [];

      for (let day = 0; day < 7; day++) {
        const count = this.generateRandomActivity(currentDate);
        const level = this.getActivityLevel(count);

        const dayActivity: DayActivity = {
          date: new Date(currentDate),
          count,
          level
        };

        if (count > maxCount) {
          maxCount = count;
          this.busiestDay = dayActivity;
        }

        this.totalActivities += count;
        currentWeek.push(dayActivity);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      weeks.push(currentWeek);
    }

    this.weeks = weeks;
  }

  private generateRandomActivity(date: Date): number {
    // Generate realistic activity patterns
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isRecent = Date.now() - date.getTime() < 30 * 24 * 60 * 60 * 1000; // Last 30 days

    // Lower activity on weekends
    if (isWeekend) {
      return Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0;
    }

    // Higher activity in recent days
    if (isRecent) {
      return Math.floor(Math.random() * 25);
    }

    // Regular activity
    return Math.floor(Math.random() * 15);
  }

  private getActivityLevel(count: number): 0 | 1 | 2 | 3 | 4 {
    if (count === 0) return 0;
    if (count <= 3) return 1;
    if (count <= 6) return 2;
    if (count <= 12) return 3;
    return 4;
  }

  getColorClass(day: DayActivity): string {
    switch (day.level) {
      case 0:
        return 'bg-green-50 border-green-100';
      case 1:
        return 'bg-green-100 border-green-200';
      case 2:
        return 'bg-green-300 border-green-400';
      case 3:
        return 'bg-green-500 border-green-600';
      case 4:
        return 'bg-green-700 border-green-800';
      default:
        return 'bg-green-50 border-green-100';
    }
  }

  getTooltip(day: DayActivity): string {
    const dateStr = this.formatDate(day.date);
    return `${day.count} assessments on ${dateStr}`;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
