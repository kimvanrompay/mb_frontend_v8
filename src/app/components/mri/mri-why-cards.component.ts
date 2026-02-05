import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Insight {
  type: 'strength' | 'risk';
  category: string;
  icon: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  metadata?: any;
}

@Component({
  selector: 'app-mri-why-cards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Why Hire (Green Flags) -->
      <div class="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-lg p-5">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
            ✓
          </div>
          <h3 class="text-lg font-bold text-emerald-900">Why Hire</h3>
        </div>

        <div *ngIf="!whyHire || whyHire.length === 0" class="text-sm text-emerald-700 italic">
          No strong hiring signals detected yet.
        </div>

        <div class="space-y-3">
          <div *ngFor="let insight of whyHire" 
               [class]="'bg-white border rounded-lg p-3 ' + (insight.severity === 'high' ? 'border-emerald-300 shadow-sm' : 'border-emerald-100')">
            <div class="flex items-start gap-2">
              <span class="text-xl">{{ insight.icon }}</span>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs font-bold text-emerald-900 uppercase">{{ insight.category }}</span>
                  <span *ngIf="insight.severity === 'high'" 
                        class="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-semibold rounded">
                    HIGH
                  </span>
                </div>
                <p class="text-sm text-gray-800 leading-relaxed">{{ insight.message }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Why Not (Red Flags) -->
      <div class="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-lg p-5">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white">
            !
          </div>
          <h3 class="text-lg font-bold text-red-900">Why Not</h3>
        </div>

        <div *ngIf="!whyNot || whyNot.length === 0" class="text-sm text-red-700 italic">
          No significant concerns detected.
        </div>

        <div class="space-y-3">
          <div *ngFor="let insight of whyNot" 
               [class]="'bg-white border rounded-lg p-3 ' + (insight.severity === 'high' ? 'border-red-300 shadow-sm' : 'border-red-100')">
            <div class="flex items-start gap-2">
              <span class="text-xl">{{ insight.icon }}</span>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs font-bold text-red-900 uppercase">{{ insight.category }}</span>
                  <span *ngIf="insight.severity === 'high'" 
                        class="px-1.5 py-0.5 bg-red-100 text-red-800 text-[10px] font-semibold rounded">
                    HIGH RISK
                  </span>
                </div>
                <p class="text-sm text-gray-800 leading-relaxed">{{ insight.message }}</p>
                <div *ngIf="insight.metadata?.suggested_action" 
                     class="mt-2 text-xs bg-amber-50 border border-amber-200 rounded px-2 py-1 text-amber-900">
                  💡 {{ insight.metadata.suggested_action }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class MriWhyCardsComponent {
  @Input() whyHire: Insight[] = [];
  @Input() whyNot: Insight[] = [];
}
