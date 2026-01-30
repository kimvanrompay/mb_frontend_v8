import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-card-base',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="meribas-card h-full">
      <div class="card-header" *ngIf="title">
        <h2>{{ title }}</h2>
        <div class="action-link" *ngIf="actionLabel" (click)="onAction()">{{ actionLabel }}</div>
      </div>
      <div class="card-content flex-grow">
        <ng-content></ng-content>
      </div>
    </div>
  `,
    styles: [`
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .action-link {
        font-size: 13px;
        color: var(--meribas-black);
        opacity: 0.6;
        cursor: pointer;
    }
    .action-link:hover { opacity: 1; text-decoration: underline; }
  `]
})
export class CardBaseComponent {
    @Input() title: string = '';
    @Input() actionLabel: string = '';

    onAction() {
        // Emit event or handle action
        console.log('Action clicked');
    }
}
