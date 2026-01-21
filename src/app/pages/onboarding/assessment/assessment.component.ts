import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OnboardingService } from '../../../services/onboarding.service';
import { AuthService } from '../../../services/auth';
import {
    RecruiterQuestion,
    Answer,
    AnswerValue,
    Locale,
    LIKERT_SCALE_LABELS,
    AssessmentSubmission
} from '../../../models/recruiter-assessment.model';

@Component({
    selector: 'app-assessment',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './assessment.component.html',
    styleUrl: './assessment.component.css'
})
export class AssessmentComponent implements OnInit {
    questions: RecruiterQuestion[] = [];
    answers: Answer[] = [];

    isLoading = false;
    isSubmitting = false;
    error: string | null = null;
    currentLocale: Locale = 'en';
    scaleOptions: AnswerValue[] = [1, 2, 3, 4, 5];

    constructor(
        private onboardingService: OnboardingService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadQuestions();
    }

    loadQuestions(): void {
        this.isLoading = true;
        this.error = null;

        const user = this.authService.getCurrentUser();
        this.currentLocale = (user as any)?.locale || 'en';

        this.onboardingService.getRecruiterQuestions(this.currentLocale).subscribe({
            next: (response) => {
                this.questions = response.questions;
                this.answers = [];
                this.isLoading = false;
            },
            error: (err: any) => {
                this.error = 'Failed to load questions. Please try again.';
                this.isLoading = false;
            }
        });
    }

    get progress(): number {
        return Math.round((this.answers.length / this.questions.length) * 100);
    }

    get canSubmit(): boolean {
        return this.answers.length === this.questions.length;
    }

    getAnswer(questionId: number): AnswerValue | null {
        return this.onboardingService.getAnswerForQuestion(this.answers, questionId);
    }

    getQuestionText(question: RecruiterQuestion): string {
        return question.content[this.currentLocale];
    }

    selectAnswer(questionId: number, value: AnswerValue): void {
        this.answers = this.answers.filter(a => a.question_id !== questionId);
        this.answers.push({ question_id: questionId, value });
        sessionStorage.setItem('assessment_answers', JSON.stringify(this.answers));
    }

    submitAssessment(): void {
        if (!this.canSubmit) {
            alert('Please answer all questions before submitting.');
            return;
        }

        this.isSubmitting = true;

        const user = this.authService.getCurrentUser();
        const submission: AssessmentSubmission = {
            locale: this.currentLocale,
            user_email: user?.email || '',
            answers: this.answers
        };

        this.onboardingService.submitRecruiterAssessment(submission).subscribe({
            next: (response: any) => {
                sessionStorage.removeItem('assessment_answers');
                this.router.navigate(['/onboarding/success'], {
                    state: { result: response.result }
                });
            },
            error: (err: any) => {
                this.isSubmitting = false;
                console.error('Submit error:', err);
                alert('Failed to submit assessment. Please try again.');
            }
        });
    }

    getScaleLabel(value: AnswerValue): string {
        return LIKERT_SCALE_LABELS[this.currentLocale][value];
    }
}
