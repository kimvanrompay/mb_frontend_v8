import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-kpi',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="meribas-card h-full justify-between">
       <span class="text-[10px] uppercase font-semibold text-gray-500 tracking-wider mb-1">{{ title }}</span>
       <div class="flex items-baseline gap-2">
          <span class="text-2xl font-semibold font-mono text-black leading-none">{{ value }}</span>
          <span *ngIf="trend" class="text-xs font-mono" [ngClass]="trend > 0 ? 'text-black' : 'text-gray-400'">
             {{ trend > 0 ? '+' : ''}}{{ trend }}%
          </span>
       </div>
    </div>
  `,
  styles: []
})
export class CardKpiComponent {
  @Input() title: string = '';
  @Input() value: string = '0';
  @Input() trend: number | null = null;
  @Input() variant: 'default' | 'warning' | 'success' = 'default';
}
