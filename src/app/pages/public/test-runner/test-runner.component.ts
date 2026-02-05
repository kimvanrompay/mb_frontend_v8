import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ColorUtils } from '../../../utils/color.utils';

interface Question {
  id: number;
  position: number;
  question_type: string; // 'likert', 'multiple_choice', 'text', 'code'
  question_text: string;
  scale?: Array<{ value: number; label: string }>; // For likert
  options?: Array<{ value: any; label: string }>; // For multiple_choice
  dimension?: string; // For MBTI
  reversed?: boolean; // For MBTI
}

interface AssessmentData {
  valid: boolean;
  assessment: {
    id: string;
    assessment_type: string;
    assessment_name: string;
    status: string;
    can_start: boolean;
    time_remaining: number;
    attempts_count: number;
    max_attempts: number;
    configuration: any;
    is_required: boolean;
  };
  candidate: {
    first_name: string;
    last_name: string;
    email: string;
  };
  job: {
    id: string;
    title: string;
    description: string;
  };
  company: {
    name: string;
    logo?: string;
    color?: string;
  };
}

@Component({
  selector: 'app-test-runner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test-runner.component.html',
  styleUrls: ['./test-runner.component.css']
})
export class TestRunnerComponent implements OnInit {
  token: string = '';
  assessmentData: AssessmentData | null = null;
  questions: Question[] = [];
  
  loading = true;
  error: string | null = null;
  
  // Assessment flow state
  assessmentStarted = false;
  assessmentCompleted = false;
  submitting = false;
  
  // Answers: question_id -> selected value
  answers: { [key: number]: number } = {};
  
  // Current question index for pagination
  currentQuestionIndex = 0;
  questionsPerPage = 1; // Show one question at a time
  
  // Brand colors
  brandColor: string = '#064E3B'; // Default emerald-900
  textColor: string = '#FFFFFF';
  
  // Timer
  timeRemaining: number = 0;
  timerDisplay: string = '';
  private timerInterval: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    
    if (!this.token) {
      this.error = 'No assessment token provided';
      this.loading = false;
      return;
    }

    this.loadAssessment();
  }

  loadAssessment() {
    this.loading = true;
    this.error = null;

    this.http.get<AssessmentData>(`${environment.apiUrl}/assessments/${this.token}`)
      .subscribe({
        next: (data) => {
          if (data.valid) {
            this.assessmentData = data;
            this.setBrandColors();
          } else {
            this.error = 'Invalid assessment';
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading assessment:', err);
          
          if (err.status === 404) {
            this.error = 'This assessment link is invalid.';
          } else if (err.status === 410) {
            this.error = err.error?.error || 'This assessment has expired or has already been completed.';
          } else {
            this.error = 'Unable to load assessment. Please try again.';
          }
          
          this.loading = false;
        }
      });
  }

  setBrandColors() {
    if (this.assessmentData?.company.color) {
      const companyColor = this.assessmentData.company.color;
      
      if (ColorUtils.isValidHex(companyColor)) {
        this.brandColor = companyColor;
        this.textColor = ColorUtils.getContrastingTextColor(companyColor);
      }
    }
  }

  startAssessment() {
    this.submitting = true;

    this.http.post<any>(`${environment.apiUrl}/assessments/${this.token}/start`, {})
      .subscribe({
        next: (response) => {
          console.log('✅ Assessment started:', response);
          this.questions = response.questions;
          this.assessmentStarted = true;
          this.submitting = false;
          
          // Start timer if time limit exists
          if (response.expires_in_minutes) {
            this.timeRemaining = response.expires_in_minutes * 60; // Convert to seconds
            this.startTimer();
          }
        },
        error: (err) => {
          console.error('❌ Error starting assessment:', err);
          this.error = err.error?.error || 'Failed to start assessment. Please try again.';
          this.submitting = false;
        }
      });
  }

  startTimer() {
    this.updateTimerDisplay();
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      this.updateTimerDisplay();
      
      if (this.timeRemaining <= 0) {
        clearInterval(this.timerInterval);
        this.submitAssessment(); // Auto-submit when time runs out
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    this.timerDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  selectAnswer(questionId: number, value: number) {
    this.answers[questionId] = value;
  }

  isQuestionAnswered(questionId: number): boolean {
    return this.answers[questionId] !== undefined;
  }

  get currentQuestion(): Question | null {
    return this.questions[this.currentQuestionIndex] || null;
  }

  get progress(): number {
    const answered = Object.keys(this.answers).length;
    const total = this.questions.length;
    return total > 0 ? Math.round((answered / total) * 100) : 0;
  }

  get allQuestionsAnswered(): boolean {
    return this.questions.length > 0 && this.questions.every(q => this.isQuestionAnswered(q.id));
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  goToQuestion(index: number) {
    this.currentQuestionIndex = index;
  }

  submitAssessment() {
    if (!this.allQuestionsAnswered) {
      alert('Please answer all questions before submitting.');
      return;
    }

    this.submitting = true;

    // Format answers for backend (new API expects 'answers' array directly)
    const formattedAnswers = this.questions.map(q => ({
      question_id: q.id,
      dimension: q.dimension,
      reversed: q.reversed,
      value: this.answers[q.id]
    }));

    this.http.post<any>(`${environment.apiUrl}/assessments/${this.token}/complete`, {
      answers: formattedAnswers
    }).subscribe({
      next: (response) => {
        console.log('✅ Assessment completed:', response);
        clearInterval(this.timerInterval);
        this.assessmentCompleted = true;
        this.submitting = false;
      },
      error: (err) => {
        console.error('❌ Error submitting assessment:', err);
        this.error = err.error?.error || 'Failed to submit assessment. Please try again.';
        this.submitting = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}
