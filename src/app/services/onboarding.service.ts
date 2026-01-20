import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    RecruiterQuestionsResponse,
    AssessmentSubmission,
    AssessmentResponse,
    Locale,
    Answer,
    AnswerValue
} from '../models/recruiter-assessment.model';

@Injectable({
    providedIn: 'root'
})
export class OnboardingService {
    private readonly API_URL = 'https://api.meribas.app/api/v1';

    constructor(private http: HttpClient) { }

    /**
     * Fetch all 27 assessment questions with multilingual content
     * @param locale Language code (en, nl, fr, de, es)
     */
    getRecruiterQuestions(locale: Locale = 'en'): Observable<RecruiterQuestionsResponse> {
        return this.http.get<RecruiterQuestionsResponse>(
            `${this.API_URL}/onboarding/recruiter_questions`,
            { params: { locale } }
        );
    }

    /**
     * Submit completed recruiter assessment
     * @param submission Assessment submission with locale, email, and answers
     */
    submitRecruiterAssessment(submission: AssessmentSubmission): Observable<AssessmentResponse> {
        return this.http.post<AssessmentResponse>(
            `${this.API_URL}/onboarding/recruiter_assessment`,
            submission
        );
    }

    /**
     * Validate answers before submission
     * @param answers Array of answers to validate
     * @returns Validation result with any errors found
     */
    validateAnswers(answers: Answer[]): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        // Check all 27 questions are answered
        if (answers.length !== 27) {
            errors.push(`All 27 questions must be answered. Currently answered: ${answers.length}`);
            return { valid: false, errors };
        }

        // Check for duplicate question IDs
        const questionIds = answers.map(a => a.question_id);
        const uniqueIds = new Set(questionIds);
        if (uniqueIds.size !== questionIds.length) {
            errors.push('Duplicate question answers found');
        }

        // Validate each answer
        answers.forEach((answer, index) => {
            const { question_id, value } = answer;

            // Validate question ID (1-27)
            if (question_id < 1 || question_id > 27 || !Number.isInteger(question_id)) {
                errors.push(`Invalid question ID at answer ${index + 1}: ${question_id}`);
            }

            // Validate value (1-5)
            if (value < 1 || value > 5 || !Number.isInteger(value)) {
                errors.push(`Invalid answer value for question ${question_id}: ${value}. Must be between 1-5`);
            }
        });

        // Check all question IDs 1-27 are present
        const expectedIds = Array.from({ length: 27 }, (_, i) => i + 1);
        const missingIds = expectedIds.filter(id => !questionIds.includes(id));
        if (missingIds.length > 0) {
            errors.push(`Missing answers for questions: ${missingIds.join(', ')}`);
        }

        return { valid: errors.length === 0, errors };
    }

    /**
     * Check if all questions have been answered
     * @param answers Current answers array
     */
    isComplete(answers: Answer[]): boolean {
        return answers.length === 27 &&
            new Set(answers.map(a => a.question_id)).size === 27;
    }

    /**
     * Get current progress percentage
     * @param answers Current answers array
     */
    getProgress(answers: Answer[]): number {
        return Math.round((answers.length / 27) * 100);
    }

    /**
     * Get answer for a specific question
     * @param answers Current answers array
     * @param questionId Question ID to find
     */
    getAnswerForQuestion(answers: Answer[], questionId: number): AnswerValue | null {
        const answer = answers.find(a => a.question_id === questionId);
        return answer ? answer.value : null;
    }
}
