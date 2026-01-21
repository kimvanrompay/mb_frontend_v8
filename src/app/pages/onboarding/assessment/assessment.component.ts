import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
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
    showProgressTracker = false; // Progress tracker panel visibility (starts closed)
    showHeaderDrawer = false; // Header questions overview drawer
    private isProcessingAnswer = false; // Prevent duplicate answer submissions

    // Locale
    currentLocale: Locale = 'en';

    // Likert scale options
    scaleOptions: AnswerValue[] = [1, 2, 3, 4, 5];

    constructor(
        private onboardingService: OnboardingService,
        private authService: AuthService,
        private notificationService: NotificationService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadQuestions();
    }

    /**
     * Load questions from API
     */
    loadQuestions(): void {
        console.log('loadQuestions() called - setting isLoading to true');
        this.isLoading = true;
        this.error = null;

        console.log('Making API call to getRecruiterQuestions...');
        this.onboardingService.getRecruiterQuestions(this.currentLocale).subscribe({
            next: (response: any) => {
                console.log('API Response received:', response);
                console.log('Response type:', typeof response);
                console.log('Response.questions:', response.questions);

                // Check if response or questions is null/undefined
                if (!response) {
                    console.error('Response is null or undefined!');
                    this.isLoading = false;
                    this.error = 'Invalid response from server';
                    this.cdr.detectChanges();
                    return;
                }

                if (!response.questions) {
                    console.error('Response.questions is null or undefined!');
                    console.error('Full response:', JSON.stringify(response));
                    this.isLoading = false;
                    this.error = 'No questions found in response';
                    this.cdr.detectChanges();
                    return;
                }

                this.questions = response.questions;
                this.isLoading = false;
                console.log('Questions loaded, isLoading set to false. Total questions:', this.questions?.length);
                console.log('Triggering change detection...');
                this.cdr.detectChanges();
                console.log('Change detection triggered');

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
                console.error('API Error occurred:', error);
                console.error('Error details:', {
                    status: error.status,
                    statusText: error.statusText,
                    message: error.message,
                    error: error.error
                });

                this.isLoading = false;
                this.error = 'Failed to load questions. Please try again.';
                this.notificationService.error('Failed to load assessment questions', 'Error');
                console.error('Error loading questions:', error);
                this.cdr.detectChanges();
            },
            complete: () => {
                console.log('Observable completed');
                // If we get here and still loading, something went wrong
                if (this.isLoading) {
                    console.error('Observable completed but isLoading is still true!');
                    console.error('Questions loaded:', this.questions?.length || 0);
                    this.isLoading = false;
                    if (!this.questions || this.questions.length === 0) {
                        this.error = 'No questions loaded';
                    }
                    this.cdr.detectChanges();
                }
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
        // Guard against duplicate rapid clicks
        if (this.isProcessingAnswer) {
            console.log('⚠️ Already processing an answer, ignoring duplicate click');
            return;
        }

        if (!this.currentQuestion) return;

        // Set processing flag
        this.isProcessingAnswer = true;
        console.log('🔒 LOCKED - processing answer');

        const questionId = this.currentQuestion.id;
        console.log('✏️ Q' + (this.currentQuestionIndex + 1) + ':', { questionId, value });

        // Remove existing answer for this question if any
        this.answers = this.answers.filter(a => a.question_id !== questionId);

        // Add new answer
        this.answers.push({ question_id: questionId, value });
        console.log('✅ Saved. Total:', this.answers.length, 'answers');

        // Save to session storage
        sessionStorage.setItem('assessment_answers', JSON.stringify(this.answers));

        // Auto-advance to next question after brief delay
        setTimeout(() => {
            console.log('📍 Advancing from Q', this.currentQuestionIndex + 1, 'to Q', this.currentQuestionIndex + 2);
            this.nextQuestion();

            // Reset processing flag after navigation completes (longer delay)
            setTimeout(() => {
                this.isProcessingAnswer = false;
                console.log('🔓 Ready for next answer');
            }, 500);
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
        // Check if all questions are answered
        const unansweredQuestions: number[] = [];
        this.questions.forEach((question, index) => {
            if (!this.isQuestionAnswered(question.id)) {
                unansweredQuestions.push(index + 1); // 1-indexed for display
            }
        });

        if (unansweredQuestions.length > 0) {
            const firstUnanswered = unansweredQuestions[0] - 1; // Convert back to 0-indexed

            // Navigate to first unanswered question
            this.currentQuestionIndex = firstUnanswered;

            // Show detailed error message
            const questionList = unansweredQuestions.length <= 5
                ? `Questions ${unansweredQuestions.join(', ')}`
                : `${unansweredQuestions.length} questions (starting at #${unansweredQuestions[0]})`;

            this.notificationService.error(
                `Please answer all questions. Missing: ${questionList}. Showing first unanswered question now.`,
                'Incomplete Assessment'
            );

            // Trigger change detection to update the UI
            this.cdr.detectChanges();
            return;
        }

        // Validate with the service (additional validation)
        const validation = this.onboardingService.validateAnswers(this.answers);
        if (!validation.valid) {
            this.notificationService.error(
                validation.errors.join('. '),
                'Validation Error'
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
     * Toggle progress tracker visibility
     */
    toggleProgressTracker(): void {
        this.showProgressTracker = !this.showProgressTracker;
    }

    /**
     * Toggle header questions drawer
     */
    toggleHeaderDrawer(): void {
        this.showHeaderDrawer = !this.showHeaderDrawer;
    }

    /**
     * Get list of unanswered question numbers (1-indexed)
     */
    getUnansweredQuestions(): number[] {
        return this.questions
            .map((q, i) => ({ id: q.id, index: i + 1 }))
            .filter(q => !this.isQuestionAnswered(q.id))
            .map(q => q.index);
    }

    /**
     * Get completion percentage
     */
    getCompletionPercentage(): number {
        return Math.round((this.answers.length / this.questions.length) * 100);
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
