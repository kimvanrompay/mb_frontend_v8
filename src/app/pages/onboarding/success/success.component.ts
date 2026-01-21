import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';
import {
    AssessmentResult,
    TYPE_NAMES,
    EnneagramType
} from '../../../models/recruiter-assessment.model';

@Component({
    selector: 'app-onboarding-success',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './success.component.html',
    styleUrl: './success.component.css'
})
export class SuccessComponent implements OnInit {
    result: AssessmentResult | null = null;
    isLoading = true;

    // Type emoji mapping
    typeEmojis: Record<EnneagramType, string> = {
        1: '⚖️',
        2: '❤️',
        3: '🎯',
        4: '🎨',
        5: '🔍',
        6: '🛡️',
        7: '✨',
        8: '💪',
        9: '🕊️'
    };

    constructor(
        private router: Router,
        private authService: AuthService
    ) {
        // Get result from navigation state
        const navigation = this.router.getCurrentNavigation();
        const state = navigation?.extras?.state;

        if (state && state['result']) {
            this.result = state['result'];
        }
    }

    ngOnInit(): void {
        // If no result in state, redirect back to assessment
        if (!this.result) {
            this.router.navigate(['/onboarding/assessment']);
            return;
        }

        this.isLoading = false;

        // Reload user data to update onboarding status
        this.authService.loadMe().subscribe({
            next: () => {
                console.log('User data refreshed after assessment completion');
            },
            error: (error) => {
                console.error('Failed to refresh user data:', error);
            }
        });
    }

    /**
     * Get emoji for dominant type
     */
    get typeEmoji(): string {
        return this.result ? this.typeEmojis[this.result.dominant_type] : '✨';
    }

    /**
     * Get sorted scores array for display
     */
    get sortedScores(): { type: EnneagramType; score: number; name: string }[] {
        if (!this.result) return [];

        return Object.entries(this.result.all_scores)
            .map(([type, score]) => ({
                type: parseInt(type) as EnneagramType,
                score,
                name: TYPE_NAMES[parseInt(type) as EnneagramType][this.result!.locale]
            }))
            .sort((a, b) => b.score - a.score);
    }

    /**
     * Get top 3 types
     */
    get topThreeTypes(): { type: EnneagramType; score: number; name: string }[] {
        return this.sortedScores.slice(0, 3);
    }

    /**
     * Navigate to dashboard
     */
    continueToDashboard(): void {
        this.router.navigate(['/dashboard']);
    }

    /**
     * Get percentage of max score
     */
    getScorePercentage(score: number): number {
        const maxScore = 15; // 3 questions × 5 max value
        return Math.round((score / maxScore) * 100);
    }

    /**
     * Get SVG path for radial chart segment
     */
    getSegmentPath(type: EnneagramType, score: number): string {
        const maxRadius = 140;
        const radius = (score / 15) * maxRadius;
        const segmentAngle = 40; // 360 / 9 = 40 degrees per segment
        const startAngle = ((type - 1) * segmentAngle) * (Math.PI / 180);
        const endAngle = (type * segmentAngle) * (Math.PI / 180);

        const centerX = 200;
        const centerY = 200;

        // Calculate arc points
        const x1 = centerX + radius * Math.cos(startAngle);
        const y1 = centerY + radius * Math.sin(startAngle);
        const x2 = centerX + radius * Math.cos(endAngle);
        const y2 = centerY + radius * Math.sin(endAngle);

        // Create path: Move to center, line to start, arc to end, line back to center
        const largeArcFlag = segmentAngle > 180 ? 1 : 0;

        return `M ${centerX},${centerY} L ${x1},${y1} A ${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} Z`;
    }
}
