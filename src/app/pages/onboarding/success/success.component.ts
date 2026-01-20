import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ENNEAGRAM_TYPES, EnneagramType } from '../../../models/enneagram.model';

@Component({
    selector: 'app-onboarding-success',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './success.component.html',
    styleUrl: './success.component.css'
})
export class SuccessComponent implements OnInit {
    profileCode: string = '';
    topThreeTypes: EnneagramType[] = [];

    constructor(private router: Router) {
        // Get profile code from navigation state
        const navigation = this.router.getCurrentNavigation();
        this.profileCode = navigation?.extras?.state?.['profileCode'] || 'UNKNOWN';
    }

    ngOnInit(): void {
        // Parse profile code to get top 3 types
        // Profile code format: "AHLPRCEI" where each letter is a type code in priority order
        if (this.profileCode && this.profileCode !== 'UNKNOWN') {
            const codeParts = this.profileCode.split('');
            this.topThreeTypes = codeParts.slice(0, 3).map(code => {
                const type = ENNEAGRAM_TYPES.find(t => t.code === code);
                return type!;
            }).filter(Boolean);
        }
    }

    continueToDashboard(): void {
        this.router.navigate(['/dashboard']);
    }
}
