import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    OnboardingStatus,
    AssessmentSubmission,
    AssessmentResponse,
    PriorityOrder
} from '../models/enneagram.model';

@Injectable({
    providedIn: 'root'
})
export class OnboardingService {
    private readonly API_URL = 'https://mb-backend-v8-8194836b1a8a.herokuapp.com/api/v1';

    constructor(private http: HttpClient) { }

    /**
     * Check if user needs onboarding and get current status
     */
    getOnboardingStatus(): Observable<OnboardingStatus> {
        return this.http.get<OnboardingStatus>(`${this.API_URL}/onboarding/status`);
    }

    /**
     * Submit completed Enneagram assessment
     */
    submitAssessment(priorityOrder: PriorityOrder): Observable<AssessmentResponse> {
        const payload: AssessmentSubmission = { priority_order: priorityOrder };
        return this.http.post<AssessmentResponse>(
            `${this.API_URL}/onboarding/complete`,
            payload
        );
    }

    /**
     * Validate priority order before submission
     * Returns validation result with any errors found
     */
    validatePriorityOrder(order: PriorityOrder): { valid: boolean; errors: string[] } {
        const errors: string[] = [];
        const ranks = Object.values(order);
        const types = Object.keys(order);

        // Check all 9 types present
        if (types.length !== 9) {
            errors.push('All 9 personality types must be ranked');
            return { valid: false, errors };
        }

        // Check all type IDs are valid (1-9)
        const validTypes = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
        for (const typeId of types) {
            if (!validTypes.includes(typeId)) {
                errors.push(`Invalid type ID: ${typeId}`);
            }
        }

        // Check all ranks are 1-9
        for (const rank of ranks) {
            if (rank < 1 || rank > 9 || !Number.isInteger(rank)) {
                errors.push('All ranks must be integers between 1 and 9');
                break;
            }
        }

        // Check no duplicates
        const uniqueRanks = new Set(ranks);
        if (uniqueRanks.size !== ranks.length) {
            const duplicates = ranks.filter((rank, index) => ranks.indexOf(rank) !== index);
            errors.push(`Duplicate ranks found: ${[...new Set(duplicates)].join(', ')}`);
        }

        // Check all ranks 1-9 are used exactly once
        const expectedRanks = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const sortedRanks = [...ranks].sort((a, b) => a - b);
        if (JSON.stringify(sortedRanks) !== JSON.stringify(expectedRanks)) {
            const missing = expectedRanks.filter(r => !ranks.includes(r));
            if (missing.length > 0) {
                errors.push(`Missing ranks: ${missing.join(', ')}`);
            }
        }

        return { valid: errors.length === 0, errors };
    }

    /**
     * Check if all 9 types have been assigned a rank
     */
    isComplete(order: PriorityOrder): boolean {
        return Object.keys(order).length === 9;
    }

    /**
     * Get the type ID that has a specific rank
     */
    getTypeByRank(order: PriorityOrder, rank: number): string | undefined {
        return Object.keys(order).find(typeId => order[typeId] === rank);
    }

    /**
     * Get the rank for a specific type
     */
    getRankByType(order: PriorityOrder, typeId: string): number | undefined {
        return order[typeId];
    }
}
