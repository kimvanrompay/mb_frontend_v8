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
import { CandidateService } from '../../services/candidate.service';
import { ApplicationService } from '../../services/application.service';
import { TenantStats, Subscription } from '../../models/tenant.model';
import { AssessmentStats } from '../../models/assessment.model';
import { Candidate } from '../../models/candidate.model';
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
  recentCandidatesData: Candidate[] = [];
  pendingApplicationsCount: number = 0;

  isLoading = false;
  error: string | null = null;

  stats = {
    activePositions: 0, // From API: tenantStats.total_jobs ✅
    totalCandidates: 'N/A' as any, // From API: tenantStats.total_candidates ✅
    inAssessment: 'N/A' as any, // From API: assessmentStats.pending ✅
    completionRate: 'N/A' as any, // From API: assessmentStats.completion_rate ✅
    avgIntegrity: 'N/A' as any, // ❌ Backend doesn't have proctoring system
    reviewsPending: 'N/A' as any, // From API: applications with status 'pending' ✅
    testsStarted: 'N/A' as any, // ❌ Backend doesn't track daily activity
    testsCompleted: 'N/A' as any, // ❌ Backend doesn't track daily activity
    liveNow: 'N/A' as any, // ❌ Backend doesn't track live sessions
    avgDuration: 'N/A' as any, // From API: assessmentStats.average_completion_time ✅
  };

  isTrialMode = true; // Track if user is in trial mode
  maxPositionsInTrial = 1;

  get canCreatePosition(): boolean {
    return !this.isTrialMode || this.stats.activePositions < this.maxPositionsInTrial;
  }

  // Real candidates from API
  recentCandidates: any[] = [];

  constructor(
    private jobService: JobService,
    private tenantService: TenantService,
    private assessmentService: AssessmentService,
    private candidateService: CandidateService,
    private applicationService: ApplicationService
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
        catchError((err) => {
          console.warn('Assessment stats not available:', err);
          return of(null);
        })
      ),
      recentCandidates: this.candidateService.getRecentCandidates(3).pipe(
        catchError((err) => {
          console.warn('Recent candidates not available:', err);
          return of([]);
        })
      ),
      pendingApplications: this.applicationService.getPendingCount().pipe(
        catchError((err) => {
          console.warn('Pending applications not available:', err);
          return of(0);
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
        this.recentCandidatesData = results.recentCandidates;
        this.pendingApplicationsCount = results.pendingApplications;

        // Map API data to stats
        if (this.tenantStats) {
          this.stats.activePositions = this.tenantStats.total_jobs || 0;
          this.stats.totalCandidates = this.tenantStats.total_candidates || 0;
        }

        if (this.assessmentStats) {
          this.stats.completionRate = Math.round(this.assessmentStats.completion_rate) || 'N/A';
          this.stats.inAssessment = this.assessmentStats.pending || 0;
          if (this.assessmentStats.average_completion_time) {
            this.stats.avgDuration = Math.round(this.assessmentStats.average_completion_time / 60) || 'N/A';
          }
        }

        // Map pending applications count
        this.stats.reviewsPending = this.pendingApplicationsCount;

        // Map recent candidates for display
        this.recentCandidates = this.recentCandidatesData.map(candidate => ({
          name: candidate.full_name,
          role: candidate.invited_for_job?.title || 'N/A',
          score: 'N/A', // Backend doesn't provide scores on candidate list
          status: this.formatCandidateStatus(candidate.status)
        }));

        // If no candidates, show placeholder
        if (this.recentCandidates.length === 0) {
          this.recentCandidates = [
            { name: 'No candidates yet', role: 'Invite candidates to get started', score: 'N/A', status: 'N/A' }
          ];
        }
      },
      error: (err) => {
        console.error('Failed to load dashboard data', err);
        this.error = 'Failed to load dashboard data. Please try again.';
      }
    });
  }

  formatCandidateStatus(status: string): string {
    // Format status for display
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  }
}
