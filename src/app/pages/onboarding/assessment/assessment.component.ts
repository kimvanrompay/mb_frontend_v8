import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OnboardingService } from '../../../services/onboarding.service';
import { AuthService } from '../../../services/auth';
import { NotificationService } from '../../../services/notification';
import {
    RecruiterQuestion,
    Answer,
    AnswerValue,
    Locale,
    LIKERT_SCALE_LABELS
} from '../../../models/recruiter-assessment.model';

@Component({
    selector: 'app-assessment',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './assessment.component.html',
    styleUrl: './assessment.component.css'
})
export class AssessmentComponent implements OnInit {
    // Questions and state
    questions: RecruiterQuestion[] = [];
    currentQuestionIndex = 0;
    answers: Answer[] = [];

    // UI state
    isLoading = false;
    isSubmitting = false;
    error: string | null = null;

    // Locale
    currentLocale: Locale = 'en';

    // Likert scale options
    scaleOptions: AnswerValue[] = [1, 2, 3, 4, 5];

    constructor(
        private onboardingService: OnboardingService,
        private authService: AuthService,
        private notificationService: NotificationService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadQuestions();
    }

    /**
     * Load questions from API
     */
    loadQuestions(): void {
        this.isLoading = true;
        this.error = null;

        this.onboardingService.getRecruiterQuestions(this.currentLocale).subscribe({
            next: (response: any) => {
                this.questions = response.questions;
                this.isLoading = false;

                // Restore any previously saved answers from session storage
                const savedAnswers = sessionStorage.getItem('assessment_answers');
                if (savedAnswers) {
                    this.answers = JSON.parse(savedAnswers);
                    // Resume from last unanswered question
                    const lastIndex = this.answers.length;
                    if (lastIndex < this.questions.length) {
                        this.currentQuestionIndex = lastIndex;
                    }
                }
            },
            error: (error: any) => {
                this.isLoading = false;
                this.error = 'Failed to load questions. Please try again.';
                this.notificationService.error('Failed to load assessment questions', 'Error');
                console.error('Error loading questions:', error);
            }
        });
    }

    /**
     * Get the current question
     */
    get currentQuestion(): RecruiterQuestion | null {
        return this.questions[this.currentQuestionIndex] || null;
    }

    /**
     * Get the question text in current locale
     */
    get currentQuestionText(): string {
        if (!this.currentQuestion) return '';
        return this.currentQuestion.content[this.currentLocale];
    }

    /**
     * Get current answer for current question
     */
    get currentAnswer(): AnswerValue | null {
        if (!this.currentQuestion) return null;
        return this.onboardingService.getAnswerForQuestion(this.answers, this.currentQuestion.id);
    }

    /**
     * Get progress percentage
     */
    get progress(): number {
        return Math.round(((this.currentQuestionIndex + 1) / this.questions.length) * 100);
    }

    /**
     * Get label for a scale value
     */
    getScaleLabel(value: AnswerValue): string {
        return LIKERT_SCALE_LABELS[this.currentLocale][value];
    }

    /**
     * Handle answer selection
     */
    selectAnswer(value: AnswerValue): void {
        if (!this.currentQuestion) return;

        const questionId = this.currentQuestion.id;

        // Remove existing answer for this question if any
        this.answers = this.answers.filter(a => a.question_id !== questionId);

        // Add new answer
        this.answers.push({ question_id: questionId, value });

        // Save to session storage
        sessionStorage.setItem('assessment_answers', JSON.stringify(this.answers));

        // Auto-advance to next question after brief delay
        setTimeout(() => {
            this.nextQuestion();
        }, 300);
    }

    /**
     * Go to next question
     */
    nextQuestion(): void {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
        } else if (this.isComplete()) {
            this.submitAssessment();
        }
    }

    /**
     * Go to previous question
     */
    previousQuestion(): void {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
        }
    }

    /**
     * Jump to specific question
     */
    goToQuestion(index: number): void {
        if (index >= 0 && index < this.questions.length) {
            this.currentQuestionIndex = index;
        }
    }

    /**
     * Check if assessment is complete
     */
    isComplete(): boolean {
        return this.onboardingService.isComplete(this.answers);
    }

    /**
     * Check if a question has been answered
     */
    isQuestionAnswered(questionId: number): boolean {
        return this.answers.some(a => a.question_id === questionId);
    }

    /**
     * Submit the assessment
     */
    submitAssessment(): void {
        // Validate answers
        const validation = this.onboardingService.validateAnswers(this.answers);
        if (!validation.valid) {
            this.notificationService.error(
                validation.errors.join('. '),
                'Incomplete Assessment'
            );
            return;
        }

        const user = this.authService.getCurrentUser();
        if (!user?.email) {
            this.notificationService.error('User email not found', 'Error');
            return;
        }

        this.isSubmitting = true;

        const submission = {
            locale: this.currentLocale,
            user_email: user.email,
            answers: this.answers
        };

        this.onboardingService.submitRecruiterAssessment(submission).subscribe({
            next: (response: any) => {
                this.isSubmitting = false;
                // Clear saved answers
                sessionStorage.removeItem('assessment_answers');
                // Navigate to success page with results
                this.router.navigate(['/onboarding/success'], {
                    state: { result: response.result }
                });
            },
            error: (error: any) => {
                this.isSubmitting = false;
                this.notificationService.error(
                    error.error?.error || 'Failed to submit assessment',
                    'Submission Error'
                );
                console.error('Error submitting assessment:', error);
            }
        });
    }

    /**
     * Get answer value for a specific question (for progress indicator)
     */
    getAnswerValue(questionId: number): AnswerValue | null {
        return this.onboardingService.getAnswerForQuestion(this.answers, questionId);
    }

    /**
     * Handle keyboard shortcuts
     * 1-5: Select answer
     * Arrow Left: Previous question
     * Arrow Right: Next question (if answered)
     */
    @HostListener('window:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent): void {
        // Don't handle if user is typing in an input
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
            return;
        }

        // Number keys 1-5 for answers
        if (event.key >= '1' && event.key <= '5') {
            event.preventDefault();
            const value = parseInt(event.key) as AnswerValue;
            this.selectAnswer(value);
        }

        // Arrow keys for navigation
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            this.previousQuestion();
        }

        if (event.key === 'ArrowRight' && this.currentAnswer !== null) {
            event.preventDefault();
            this.nextQuestion();
        }
    }
}
