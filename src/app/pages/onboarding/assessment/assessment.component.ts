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
    questions: RecruiterQuestion[] = [];
    answers: Answer[] = [];
    currentPage = 0;
    questionsPerPage = 3;

    isLoading = false;
    isSubmitting = false;
    error: string | null = null;
    currentLocale: Locale = 'en';
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

    loadQuestions(): void {
        this.isLoading = true;
        this.error = null;

        const user = this.authService.getCurrentUser();
        this.currentLocale = user?.locale || 'en';

        this.onboardingService.getRecruiterQuestions(this.currentLocale).subscribe({
            next: (questions) => {
                this.questions = questions;
                this.answers = [];
                this.currentPage = 0;
                this.isLoading = false;
            },
            error: (err) => {
                this.error = 'Failed to load questions. Please try again.';
                this.isLoading = false;
            }
        });
    }

    get currentQuestions(): RecruiterQuestion[] {
        const start = this.currentPage * this.questionsPerPage;
        const end = start + this.questionsPerPage;
        return this.questions.slice(start, end);
    }

    get totalPages(): number {
        return Math.ceil(this.questions.length / this.questionsPerPage);
    }

    get progress(): number {
        return Math.round((this.answers.length / this.questions.length) * 100);
    }

    get canGoNext(): boolean {
        // Check if all questions on current page are answered
        const currentQuestions = this.currentQuestions;
        return currentQuestions.every(q => this.getAnswer(q.id) !== null);
    }

    get isLastPage(): boolean {
        return this.currentPage === this.totalPages - 1;
    }

    getAnswer(questionId: string): AnswerValue | null {
        return this.onboardingService.getAnswerForQuestion(this.answers, questionId);
    }

    selectAnswer(questionId: string, value: AnswerValue): void {
        // Remove existing answer for this question
        this.answers = this.answers.filter(a => a.question_id !== questionId);

        // Add new answer
        this.answers.push({ question_id: questionId, value });

        // Save to session storage
        sessionStorage.setItem('assessment_answers', JSON.stringify(this.answers));
    }

    nextPage(): void {
        if (this.canGoNext && !this.isLastPage) {
            this.currentPage++;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    previousPage(): void {
        if (this.currentPage > 0) {
            this.currentPage--;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    submitAssessment(): void {
        if (!this.canGoNext) {
            alert('Please answer all questions on this page.');
            return;
        }

        if (this.answers.length !== this.questions.length) {
            alert('Please answer all questions before submitting.');
            return;
        }

        this.isSubmitting = true;

        this.onboardingService.submitRecruiterAnswers(this.answers, this.currentLocale).subscribe({
            next: (result: any) => {
                sessionStorage.removeItem('assessment_answers');
                this.router.navigate(['/onboarding/success'], {
                    state: { result }
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
