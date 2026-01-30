import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-coming-soon',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div class="meribas-card max-w-lg w-full p-12 flex flex-col items-center animate-fade-in-up">
        <div class="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
            <svg class="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h1 class="text-4xl font-bold text-[var(--meribas-black)] mb-4">Coming Soon</h1>
        <p class="text-gray-500 mb-8 text-lg">We are working hard to bring you this feature. You will be redirected to the dashboard in <span class="font-mono font-bold">{{ secondsLeft }}</span> seconds.</p>
        
        <div class="w-full bg-gray-100 rounded-full h-2 mb-8 overflow-hidden">
            <div class="bg-[var(--accent-green-600)] h-2 rounded-full transition-all duration-1000 ease-linear" [style.width.%]="(secondsLeft / 300) * 100"></div>
        </div>

        <a routerLink="/dashboard" class="px-6 py-3 bg-[var(--meribas-black)] text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
            Go to Dashboard Now
        </a>
      </div>
    </div>
  `,
    styles: [`
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
        animation: fadeInUp 0.6s ease-out forwards;
    }
  `]
})
export class ComingSoonComponent implements OnInit, OnDestroy {
    secondsLeft = 300; // 5 minutes
    private timer: any;

    constructor(private router: Router) { }

    ngOnInit(): void {
        this.timer = setInterval(() => {
            this.secondsLeft--;
            if (this.secondsLeft <= 0) {
                this.router.navigate(['/dashboard']);
            }
        }, 1000);
    }

    ngOnDestroy(): void {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
}
