import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { TrialBannerComponent } from '../../components/trial-banner/trial-banner.component';
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
  imports: [CommonModule, NavbarComponent, TrialBannerComponent],
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
      },
      error: (err) => {
        console.error('Failed to load dashboard data', err);
        this.error = 'Failed to load dashboard data. Please try again.';
      }
    });
  }

  // Helpers for view rendering
  getInitials(title: string): string {
    return title.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }

  getInitialsBg(title: string): string {
    // Simple deterministic color mapping based on string length or first char
    const colors = [
      'bg-gray-900 text-white',
      'bg-blue-900 text-white',
      'bg-indigo-900 text-white',
      'bg-gray-700 text-white'
    ];
    return colors[title.length % colors.length];
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'filled': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  }

  formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";

    return Math.floor(seconds) + "s ago";
  }
}
