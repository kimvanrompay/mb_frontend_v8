import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardBaseComponent } from '../card-base/card-base.component';

@Component({
  selector: 'app-card-kpi',
  standalone: true,
  imports: [CommonModule, CardBaseComponent],
  template: `
    <app-card-base [title]="title">
      <div class="flex flex-col items-center justify-center h-full pb-2">
         <div class="text-4xl font-[800] tracking-tight leading-none mb-1" 
              [ngClass]="{'text-[var(--meribas-black)]': !isAlert, 'text-[var(--status-flagged)]': isAlert}">
            {{ value }}
         </div>
         <div class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{{ subtext }}</div>
         
         <div *ngIf="trend" class="mt-4 flex items-center text-xs font-medium" 
              [ngClass]="trend > 0 ? 'text-[var(--accent-green-600)]' : 'text-red-600'">
            <span *ngIf="trend > 0">↑</span><span *ngIf="trend < 0">↓</span>
            <span class="ml-1">{{ trend }}% vs last month</span>
         </div>
      </div>
    </app-card-base>
  `,
  styles: []
})
export class CardKpiComponent {
  @Input() title: string = '';
  @Input() value: string = '0';
  @Input() subtext: string = '';
  @Input() trend: number | null = null;
  @Input() isAlert: boolean = false;
}
