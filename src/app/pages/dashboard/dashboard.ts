import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarBlackComponent } from '../../components/layout/sidebar-black/sidebar-black.component';
import { TopbarWhiteComponent } from '../../components/layout/topbar-white/topbar-white.component';
import { CardKpiComponent } from '../../components/cards/card-kpi/card-kpi.component';
import { CardBaseComponent } from '../../components/cards/card-base/card-base.component';
import { GaugeTrustComponent } from '../../components/charts/gauge-trust/gauge-trust.component';
import { SkillBreakdownComponent } from '../../components/charts/skill-breakdown/skill-breakdown.component';
import { CardCandidateRowComponent } from '../../components/cards/card-candidate-row/card-candidate-row.component';

import { JobService } from '../../services/job.service';
import { Job } from '../../models/job.model';
import { TenantService } from '../../services/tenant.service';
import { AssessmentService } from '../../services/assessment.service';
import { TenantStats, Subscription } from '../../models/tenant.model';
import { AssessmentStats } from '../../models/assessment.model';
import { finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SidebarBlackComponent,
    TopbarWhiteComponent,
    CardKpiComponent,
    CardBaseComponent,
    GaugeTrustComponent,
    SkillBreakdownComponent,
    CardCandidateRowComponent
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

  // Mock Data for new widgets (Replace with real API data later)
  trustScore = 98;
  activeCandidatesCount = 620;
  completedCandidatesCount = 420;
  liveCandidates = [
    { name: 'Alice Freeman', test: 'Python Advanced', status: 'Verify', avatar: null, isLive: true },
    { name: 'Bob Smith', test: 'Cognitive Ability', status: 'Flagged', avatar: null, isLive: true },
    { name: 'Charlie Davis', test: 'Personality Fit', status: 'Verified', avatar: null, isLive: false },
    { name: 'Diana Prince', test: 'Java Backend', status: 'Suspicious', avatar: null, isLive: true }
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
          this.activeCandidatesCount = this.tenantStats.total_candidates || 0;
        }
      },
      error: (err) => {
        console.error('Failed to load dashboard data', err);
        this.error = 'Failed to load dashboard data. Please try again.';
      }
    });
  }
}
