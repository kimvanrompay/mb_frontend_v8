import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardKpiComponent } from '../../components/cards/card-kpi/card-kpi.component';
import { GaugeTrustComponent } from '../../components/gauge-trust/gauge-trust.component';
import { SkillBreakdownComponent } from '../../components/skill-breakdown/skill-breakdown.component';
import { CardCandidateRowComponent } from '../../components/cards/card-candidate-row/card-candidate-row.component';
import { ActivityHeatmapComponent } from '../../components/activity-heatmap/activity-heatmap.component';

import { JobService } from '../../services/job.service';
import { Job } from '../../models/job.model';
import { TenantService } from '../../services/tenant.service';
import { AssessmentService } from '../../services/assessment.service';
import { TenantStats, Subscription } from '../../models/tenant.model';
import { AssessmentStats } from '../../models/assessment.model';
import { finalize, forkJoin } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
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
    activeJobs: 12,
    totalCandidates: 248,
    inAssessment: 34,
    pendingReviews: 5,
    interviewsToday: 3,
    avgIntegrity: 94,
    completionRate: 87,
    testsStarted: 18,
    testsCompleted: 12,
    liveNow: 3,
    avgDuration: 42
  };

  recentCandidates = [
    { name: 'Alice Freeman', role: 'Senior Python Engineer', score: 92, status: 'Active' },
    { name: 'Bob Smith', role: 'Product Manager', score: 88, status: 'Review' },
    { name: 'Charlie Davis', role: 'UX Designer', score: 95, status: 'Verified' },
  ];

  constructor(
    private jobService: JobService,
    private tenantService: TenantService,
    private assessmentService: AssessmentService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.error = null;

    forkJoin({
      jobsResponse: this.jobService.getJobs(),
      tenantResponse: this.tenantService.getTenant(),
      assessmentStats: this.assessmentService.getStats()
    }).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (results) => {
        this.jobs = results.jobsResponse.jobs;
        this.tenantStats = results.tenantResponse.tenant.stats;
        this.subscription = results.tenantResponse.tenant.subscription;
        this.assessmentStats = results.assessmentStats;

        // Map API data to view models if needed
        if (this.tenantStats) {
          // this.stats.activeJobs = this.tenantStats.active_jobs || 0;
          // Keep mock stats for now as requested unless API has them all
        }
      },
      error: (err) => {
        console.error('Failed to load dashboard data', err);
        this.error = 'Failed to load dashboard data. Please try again.';
      }
    });
  }
}
