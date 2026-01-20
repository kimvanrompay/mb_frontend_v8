import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OnboardingService } from '../../../services/onboarding.service';
import { NotificationService } from '../../../services/notification';
import { ENNEAGRAM_TYPES, EnneagramType, PriorityOrder } from '../../../models/enneagram.model';

@Component({
    selector: 'app-onboarding-assessment',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './assessment.component.html',
    styleUrl: './assessment.component.css'
})
export class AssessmentComponent implements OnInit {
    allTypes: EnneagramType[] = ENNEAGRAM_TYPES;
    priorityOrder: PriorityOrder = {};
    currentStep = 1; // Which rank we're currently assigning (1-9)
    selectedType: EnneagramType | null = null;
    showDetailModal = false;
    isSubmitting = false;
    errorMessage = '';

    constructor(
        private router: Router,
        private onboardingService: OnboardingService,
        private notificationService: NotificationService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        // Initialize empty priority order
        this.allTypes.forEach(type => {
            this.priorityOrder[type.id] = 0; // 0 means unranked
        });
    }

    /**
     * Get types that haven't been ranked yet
     */
    get unrankedTypes(): EnneagramType[] {
        return this.allTypes.filter(type => this.priorityOrder[type.id] === 0);
    }

    /**
     * Get types that have been ranked, sorted by rank
     */
    get rankedTypes(): EnneagramType[] {
        return this.allTypes
            .filter(type => this.priorityOrder[type.id] > 0)
            .sort((a, b) => this.priorityOrder[a.id] - this.priorityOrder[b.id]);
    }

    /**
     * Check if a type has been ranked
     */
    isRanked(typeId: string): boolean {
        return this.priorityOrder[typeId] > 0;
    }

    /**
     * Get the rank for a type
     */
    getRank(typeId: string): number {
        return this.priorityOrder[typeId];
    }

    /**
     * Get rank label (1st, 2nd, 3rd, etc.)
     */
    getRankLabel(rank: number): string {
        const labels: { [key: number]: string } = {
            1: '1st', 2: '2nd', 3: '3rd', 4: '4th', 5: '5th',
            6: '6th', 7: '7th', 8: '8th', 9: '9th'
        };
        return labels[rank] || `${rank}th`;
    }

    /**
     * Select a type for the current rank
     */
    selectType(type: EnneagramType): void {
        if (this.isRanked(type.id)) {
            // Already ranked, do nothing
            return;
        }

        // Assign current step as rank
        this.priorityOrder[type.id] = this.currentStep;

        // Move to next step if not done
        if (this.currentStep < 9) {
            this.currentStep++;
        }

        this.errorMessage = '';
    }

    /**
     * Unrank a type (remove its ranking)
     */
    unrankType(typeId: string): void {
        const removedRank = this.priorityOrder[typeId];
        this.priorityOrder[typeId] = 0;

        // Shift down all ranks higher than the removed one
        Object.keys(this.priorityOrder).forEach(id => {
            if (this.priorityOrder[id] > removedRank) {
                this.priorityOrder[id]--;
            }
        });

        // Go back to the removed rank step
        this.currentStep = removedRank;
        this.errorMessage = '';
    }

    /**
     * Show type details in modal
     */
    viewDetails(type: EnneagramType): void {
        this.selectedType = type;
        this.showDetailModal = true;
    }

    /**
     * Close detail modal
     */
    closeModal(): void {
        this.showDetailModal = false;
        this.selectedType = null;
    }

    /**
     * Select type from modal and close
     */
    selectFromModal(): void {
        if (this.selectedType) {
            this.selectType(this.selectedType);
            this.closeModal();
        }
    }

    /**
     * Check if all types are ranked
     */
    get isComplete(): boolean {
        return this.unrankedTypes.length === 0;
    }

    /**
     * Get progress percentage
     */
    get progressPercent(): number {
        return Math.round((this.rankedTypes.length / 9) * 100);
    }

    /**
     * Submit the assessment
     */
    submitAssessment(): void {
        // Validate
        const validation = this.onboardingService.validatePriorityOrder(this.priorityOrder);
        if (!validation.valid) {
            this.errorMessage = validation.errors.join('. ');
            this.notificationService.error(this.errorMessage, 'Validation Error');
            return;
        }

        this.isSubmitting = true;
        this.errorMessage = '';
        this.cdr.detectChanges();

        this.onboardingService.submitAssessment(this.priorityOrder).subscribe({
            next: (response) => {
                this.isSubmitting = false;
                this.notificationService.success(
                    'Your personality profile has been created!',
                    'Assessment Complete'
                );
                // Navigate to success screen with the profile code
                this.router.navigate(['/onboarding/success'], {
                    state: { profileCode: response.user.enneagram_priority_code }
                });
            },
            error: (error) => {
                this.isSubmitting = false;
                this.cdr.detectChanges();

                const errorMsg = error.error?.error || 'Failed to submit assessment. Please try again.';
                this.errorMessage = errorMsg;
                this.notificationService.error(errorMsg, 'Submission Failed');

                console.error('Assessment submission error:', error);
            }
        });
    }

    /**
     * Go back to previous step
     */
    goBack(): void {
        if (this.currentStep > 1) {
            // Find the last ranked type and unrank it
            const lastRankedType = this.allTypes.find(t => this.priorityOrder[t.id] === this.currentStep - 1);
            if (lastRankedType) {
                this.unrankType(lastRankedType.id);
            }
        }
    }
}
