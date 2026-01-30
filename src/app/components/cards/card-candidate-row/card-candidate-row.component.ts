import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-card-candidate-row',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer px-2 rounded-md">
      <div class="flex items-center">
        <!-- Status Dot aka Live Feed Pulse -->
        <span class="relative flex h-2.5 w-2.5 mr-3" *ngIf="isLive">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-green-400)] opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--accent-green-500)]"></span>
        </span>
        <div class="h-8 w-8 rounded-full bg-gray-200 flex flex-shrink-0 overflow-hidden">
           <!-- Placeholder Avatar -->
           <img *ngIf="avatarUrl" [src]="avatarUrl" class="h-full w-full object-cover">
           <span *ngIf="!avatarUrl" class="h-full w-full flex items-center justify-center text-[10px] font-bold text-gray-500">{{ initials }}</span>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-[var(--meribas-black)]">{{ name }}</p>
          <p class="text-xs text-gray-500">{{ testName }}</p>
        </div>
      </div>
      <div>
         <span class="integrity-badge" [ngClass]="statusClass">
            {{ status }}
         </span>
      </div>
    </div>
  `,
    styles: []
})
export class CardCandidateRowComponent {
    @Input() name: string = '';
    @Input() testName: string = '';
    @Input() status: string = 'Active';
    @Input() isLive: boolean = false;
    @Input() avatarUrl: string | null = null;

    get initials(): string {
        return this.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }

    get statusClass(): string {
        if (this.status === 'Verified' || this.status === 'Passed') return 'verified';
        if (this.status === 'Suspicious' || this.status === 'Flagged') return 'suspicious';
        return '';
    }
}
