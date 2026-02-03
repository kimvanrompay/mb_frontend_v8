import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardKpiComponent } from '../../components/cards/card-kpi/card-kpi.component';
import { GaugeTrustComponent } from '../../components/charts/gauge-trust/gauge-trust.component';
import { SkillBreakdownComponent } from '../../components/charts/skill-breakdown/skill-breakdown.component';
import { CardCandidateRowComponent } from '../../components/cards/card-candidate-row/card-candidate-row.component';
import { ActivityHeatmapComponent } from '../../components/activity-heatmap/activity-heatmap.component';

import { JobService } from '../../services/job.service';
import { Job } from '../../models/job.model';
import { TenantService } from '../../services/tenant.service';
import { AssessmentService } from '../../services/assessment.service';
import { TenantStats, Subscription } from '../../models/tenant.model';
import { AssessmentStats } from '../../models/assessment.model';
import { finalize, forkJoin, catchError, of } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CardKpiComponent,
    GaugeTrustComponent,
    SkillBreakdownComponent,
    CardCandidateRowComponent,
    ActivityHeatmapComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {

  jobs: Job[] = [];
  tenantStats: TenantStats | null = null;
  subscription: Subscription | null = null;
  assessmentStats: AssessmentStats | null = null;

  isLoading = false;
  error: string | null = null;

  stats = {
    activePositions: 0, // From API: tenantStats.total_jobs
    totalCandidates: 'N/A' as any, // API needed: /candidates/stats
    inAssessment: 'N/A' as any, // API needed: /assessments/stats (in_progress)
    completionRate: 'N/A' as any, // API available from assessmentStats.completion_rate
    avgIntegrity: 'N/A' as any, // API needed: /proctoring/stats (avg_integrity_score)
    reviewsPending: 'N/A' as any, // API needed: /assessments/stats (pending_review)
    testsStarted: 'N/A' as any, // API needed: /assessments/stats (started_today)
    testsCompleted: 'N/A' as any, // API needed: /assessments/stats (completed_today)
    liveNow: 'N/A' as any, // API needed: /assessments/stats (live_now)
    avgDuration: 'N/A' as any, // API available from assessmentStats.average_completion_time
  };

  isTrialMode = true; // Track if user is in trial mode
  maxPositionsInTrial = 1;

  get canCreatePosition(): boolean {
    return !this.isTrialMode || this.stats.activePositions < this.maxPositionsInTrial;
  }

  // API needed: /candidates/recent
  recentCandidates = [
    { name: 'N/A', role: 'N/A', score: 0, status: 'N/A' },
  ];

  constructor(
    private jobService: JobService,
    private tenantService: TenantService,
    private assessmentService: AssessmentService
  ) { }

  isDropdownOpen = false;
  isNewPositionModalOpen = false;

  newPosition = {
    title: '',
    department: '',
    location: '',
    employmentType: ''
  };

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  openNewPositionModal(): void {
    this.isNewPositionModalOpen = true;
    this.closeDropdown();
  }

  closeNewPositionModal(): void {
    this.isNewPositionModalOpen = false;
    this.resetNewPosition();
  }

  resetNewPosition(): void {
    this.newPosition = {
      title: '',
      department: '',
      location: '',
      employmentType: ''
    };
  }

  createPosition(): void {
    if (!this.newPosition.title) return;

    console.log('Creating position:', this.newPosition);
    // TODO: Implement API call to create position
    // this.jobService.createJob(this.newPosition).subscribe(...)

    this.closeNewPositionModal();
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.error = null;

    forkJoin({
      jobsResponse: this.jobService.getJobs(),
      tenantResponse: this.tenantService.getTenant(),
      assessmentStats: this.assessmentService.getStats().pipe(
        // Make assessment stats optional - catch error and return null
        // This prevents the entire dashboard from failing if the endpoint doesn't exist
        catchError((err) => {
          console.warn('Assessment stats not available:', err);
          return of(null);
        })
      )
    }).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (results) => {
        this.jobs = results.jobsResponse;
        this.tenantStats = results.tenantResponse.tenant.stats;
        this.subscription = results.tenantResponse.tenant.subscription;
        this.assessmentStats = results.assessmentStats;

        // Map API data to stats where available
        if (this.tenantStats) {
          this.stats.activePositions = this.tenantStats.total_jobs || 0;
          // totalCandidates: this.tenantStats.total_candidates (if available, currently shows N/A)
        }

        if (this.assessmentStats) {
          this.stats.completionRate = Math.round(this.assessmentStats.completion_rate) || 'N/A';
          if (this.assessmentStats.average_completion_time) {
            this.stats.avgDuration = Math.round(this.assessmentStats.average_completion_time / 60) || 'N/A'; // Convert seconds to minutes
          }
        }
      },
      error: (err) => {
        console.error('Failed to load dashboard data', err);
        this.error = 'Failed to load dashboard data. Please try again.';
      }
    });
  }
}
