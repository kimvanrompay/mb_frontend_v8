import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth';

@Component({
    selector: 'app-trial-banner',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './trial-banner.component.html',
    styleUrl: './trial-banner.component.css'
})
export class TrialBannerComponent implements OnInit {
    user: User | null = null;
    isDismissed = false;
    daysRemaining = 3;

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        this.authService.currentUser$.subscribe(user => {
            this.user = user;
            this.calculateDaysRemaining();
        });

        // Check if banner was dismissed in this session
        this.isDismissed = sessionStorage.getItem('trial_banner_dismissed') === 'true';
    }

    calculateDaysRemaining(): void {
        if (this.user?.trial_ends_at) {
            const trialEnd = new Date(this.user.trial_ends_at);
            const now = new Date();
            const diffTime = trialEnd.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            this.daysRemaining = diffDays > 0 ? diffDays : 0;
        } else {
            // Default: 3 days remaining if no trial_ends_at
            this.daysRemaining = 3;
        }
    }

    dismiss(): void {
        this.isDismissed = true;
        sessionStorage.setItem('trial_banner_dismissed', 'true');
    }

    upgradePlan(): void {
        // TODO: Navigate to upgrade page
        console.log('Navigate to upgrade plan');
    }

    get shouldShow(): boolean {
        return !this.isDismissed && this.daysRemaining >= 0;
    }
}
