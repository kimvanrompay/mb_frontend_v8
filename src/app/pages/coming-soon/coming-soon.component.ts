import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-coming-soon',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center max-w-md px-6">
        <div class="mb-6">
          <svg class="w-20 h-20 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        
        <h1 class="text-2xl font-bold text-black mb-2">Coming Soon</h1>
        <p class="text-sm text-gray-600 mb-6">
          This feature is currently under development and will be available soon.
        </p>
        
        <div class="flex items-center justify-center gap-2 text-xs text-gray-500 font-mono mb-4">
          <span>Redirecting to dashboard in</span>
          <span class="font-bold text-black">{{ countdown }}</span>
          <span>seconds...</span>
        </div>

        <div class="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
          <div class="bg-black h-full transition-all duration-1000 ease-linear" 
               [style.width.%]="(5 - countdown) * 20"></div>
        </div>
      </div>
    </div>
  `
})
export class ComingSoonComponent implements OnInit, OnDestroy {
    countdown = 5;
    private intervalId: any;

    constructor(private router: Router) { }

    ngOnInit() {
        this.intervalId = setInterval(() => {
            this.countdown--;
            if (this.countdown === 0) {
                clearInterval(this.intervalId);
                this.router.navigate(['/dashboard']);
            }
        }, 1000);
    }

    ngOnDestroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}
