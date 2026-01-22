import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';
import { I18nService } from '../../../services/i18n.service';
import {
    AssessmentResult,
    TYPE_NAMES,
    EnneagramType
} from '../../../models/recruiter-assessment.model';

interface ProfileSection {
    title: string;
    subtitle: string;
    userQuestion: string;
    goal: string;
    hasData: boolean;
    placeholder?: string;
}

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
    typeColor: string = '#000000';

    // Structured sections for the results page
    sections: ProfileSection[] = [
        {
            title: 'Headline & Summary',
            subtitle: 'Your core personality type',
            userQuestion: 'Is this accurate?',
            goal: 'Validation',
            hasData: true
        },
        {
            title: 'Visual Graph',
            subtitle: 'Your score across all 9 types',
            userQuestion: 'How extreme am I?',
            goal: 'Nuance',
            hasData: true
        },
        {
            title: 'Strengths & Weaknesses',
            subtitle: 'What makes you effective and what holds you back',
            userQuestion: 'What am I good/bad at?',
            goal: 'Ego/Reflection',
            hasData: false,
            placeholder: 'Detailed strengths and weaknesses will be available soon'
        },
        {
            title: 'Work & Career',
            subtitle: 'How to apply this in your recruiting role',
            userQuestion: 'How do I use this at my job?',
            goal: 'Utility',
            hasData: false,
            placeholder: 'Career insights and practical applications coming soon'
        },
        {
            title: 'Stress Profile',
            subtitle: 'How you behave under pressure',
            userQuestion: 'Why do I act weird under pressure?',
            goal: 'Awareness',
            hasData: false,
            placeholder: 'Stress behavior patterns will be added in the next update'
        },
        {
            title: 'Action Plan',
            subtitle: 'Steps for personal development',
            userQuestion: 'How do I get better?',
            goal: 'Growth',
            hasData: false,
            placeholder: 'Personalized growth recommendations coming soon'
        }
    ];

    constructor(
        private router: Router,
        private authService: AuthService,
        public i18nService: I18nService
    ) {
        // Get result from navigation state
        const navigation = this.router.getCurrentNavigation();
        const state = navigation?.extras?.state;

        if (state && state['result']) {
            this.result = state['result'];
            // Extract type color if available
            if (this.result && (this.result as any).type_color) {
                this.typeColor = (this.result as any).type_color;
            }
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
     * Get sorted scores array for display
     */
    get sortedScores(): { type: EnneagramType; score: number; name: string; percentage: number }[] {
        if (!this.result) return [];

        const maxScore = 15; // 3 questions × 5 max rating
        return Object.entries(this.result.all_scores)
            .map(([type, score]) => ({
                type: parseInt(type) as EnneagramType,
                score,
                name: TYPE_NAMES[parseInt(type) as EnneagramType][this.result!.locale],
                percentage: Math.round((score / maxScore) * 100)
            }))
            .sort((a, b) => b.score - a.score);
    }

    /**
     * Get top 3 types
     */
    get topThreeTypes() {
        return this.sortedScores.slice(0, 3);
    }

    /**
     * Get color for score bar based on rank
     */
    getScoreBarColor(index: number): string {
        if (index === 0) return 'bg-black';
        if (index === 1) return 'bg-gray-600';
        if (index === 2) return 'bg-gray-400';
        return 'bg-gray-300';
    }

    /**
     * Navigate to dashboard
     */
    continueToDashboard(): void {
        this.router.navigate(['/dashboard']);
    }
}
