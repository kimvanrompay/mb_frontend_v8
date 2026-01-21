import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
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
        // Add cache-busting headers AND timestamp to prevent 304 responses
        const timestamp = new Date().getTime();
        const headers = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });

        return this.http.get<RecruiterQuestionsResponse>(
            `${this.API_URL}/onboarding/recruiter_questions`,
            {
                params: {
                    locale,
                    _t: timestamp.toString()  // Cache-busting parameter
                },
                headers: headers
            }
        ).pipe(
            tap(response => {
                console.log('Recruiter questions loaded:', response);
                console.log('Questions array:', (response as any).questions);
            })
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

        // Check total number of answers
        if (answers.length !== 27) {
            errors.push(`All 27 questions must be answered. Currently answered: ${answers.length}`);
        }

        // Check each answer
        answers.forEach(answer => {
            if (!answer.question_id) {
                errors.push('All answers must have a question_id');
            }
            if (answer.value < 1 || answer.value > 5) {
                errors.push(`Answer value must be between 1 and 5. Got: ${answer.value}`);
            }
        });

        // Check for duplicate question IDs
        const questionIds = answers.map(a => a.question_id);
        const duplicates = questionIds.filter((id, index) => questionIds.indexOf(id) !== index);
        if (duplicates.length > 0) {
            errors.push(`Duplicate answers found for questions: ${duplicates.join(', ')}`);
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Check if all required questions have been answered
     * @param answers Current answers array
     * @returns True if all 27 questions are answered
     */
    isComplete(answers: Answer[]): boolean {
        return answers.length === 27;
    }

    /**
     * Get progress percentage
     * @param answers Current answers array
     * @returns Progress percentage (0-100)
     */
    getProgress(answers: Answer[]): number {
        return Math.round((answers.length / 27) * 100);
    }

    /**
     * Get an answer for a specific question
     * @param answers Current answers array
     * @param questionId Question ID to find
     * @returns Answer value or null if not found
     */
    getAnswerForQuestion(answers: Answer[], questionId: number): AnswerValue | null {
        const answer = answers.find(a => a.question_id === questionId);
        return answer ? answer.value : null;
    }
}
