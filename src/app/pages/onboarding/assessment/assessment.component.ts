import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadQuestions();
    }

    loadQuestions(): void {
        console.log('🔄 Loading assessment questions...');
        this.isLoading = true;
        this.error = null;

        const user = this.authService.getCurrentUser();
        console.log('👤 Current user:', user);

        if (!user) {
            console.error('❌ No user found - redirecting to login');
            this.error = 'You must be logged in to access this page.';
            this.isLoading = false;
            this.router.navigate(['/login']);
            return;
        }

        this.currentLocale = (user as any)?.locale || 'en';
        console.log('🌐 Using locale:', this.currentLocale);

        this.onboardingService.getRecruiterQuestions(this.currentLocale).subscribe({
            next: (response) => {
                console.log('✅ Questions loaded successfully:', response);
                console.log('📊 Response structure:', {
                    hasQuestions: !!response.questions,
                    questionsLength: response.questions?.length,
                    questionsType: typeof response.questions,
                    isArray: Array.isArray(response.questions)
                });

                this.questions = response.questions;
                this.answers = [];

                console.log('📝 Component state after assignment:', {
                    questionsLength: this.questions?.length,
                    isLoading: this.isLoading,
                    answersLength: this.answers.length
                });

                this.isLoading = false;
                console.log('🎯 isLoading set to FALSE');
                console.log('🔄 Current isLoading value:', this.isLoading);

                // Explicitly trigger change detection
                this.cdr.detectChanges();
                console.log('✨ Change detection triggered');

                // Double-check the state
                setTimeout(() => {
                    console.log('⏰ After timeout check:', {
                        isLoading: this.isLoading,
                        questionsCount: this.questions.length
                    });
                }, 100);
            },
            error: (err: any) => {
                console.error('❌ Failed to load questions:', err);
                console.error('Error status:', err.status);
                console.error('Error message:', err.message);

                // Show specific error message based on status code
                if (err.status === 401) {
                    this.error = 'Your session has expired. Please log in again.';
                    setTimeout(() => this.router.navigate(['/login']), 2000);
                } else if (err.status === 404) {
                    this.error = 'Assessment questions not found. Please contact support.';
                } else if (err.status === 0) {
                    this.error = 'Cannot connect to server. Please check your internet connection.';
                } else {
                    this.error = `Failed to load questions: ${err.error?.message || err.message || 'Unknown error'}`;
                }

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
