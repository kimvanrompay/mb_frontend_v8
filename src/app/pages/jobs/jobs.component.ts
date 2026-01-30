import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarBlackComponent } from '../../components/layout/sidebar-black/sidebar-black.component';
import { TopbarWhiteComponent } from '../../components/layout/topbar-white/topbar-white.component';
import { CardBaseComponent } from '../../components/cards/card-base/card-base.component';
import { JobService } from '../../services/job.service';
import { Job } from '../../models/job.model';
import { finalize } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-jobs',
    standalone: true,
    imports: [
        CommonModule,
        SidebarBlackComponent,
        TopbarWhiteComponent,
        CardBaseComponent,
        RouterModule
    ],
    templateUrl: './jobs.component.html',
    styleUrl: './jobs.component.css'
})
export class JobsComponent implements OnInit {

    jobs: Job[] = [];
    isLoading = false;
    error: string | null = null;
    viewMode: 'grid' | 'list' = 'grid'; // Default to Grid view

    constructor(private jobService: JobService) { }

    ngOnInit(): void {
        this.loadJobs();
    }

    loadJobs(): void {
        this.isLoading = true;
        this.error = null;
        this.jobService.getJobs()
            .pipe(finalize(() => this.isLoading = false))
            .subscribe({
                next: (response) => {
                    this.jobs = response.jobs;
                },
                error: (err) => {
                    console.error('Error loading jobs', err);
                    this.error = 'Failed to load jobs. Please try again.';
                }
            });
    }

    toggleView(mode: 'grid' | 'list'): void {
        this.viewMode = mode;
    }

    // Helpers
    getIntegrityColor(score: number): string {
        if (score >= 90) return 'var(--accent-green-600)';
        if (score >= 70) return 'var(--status-warning)';
        return 'var(--status-flagged)';
    }

    // Mock Integrity Score until API provides it
    getIntegrityScore(job: Job): number {
        // Deterministic mock based on ID
        return 70 + (job.id * 7) % 30;
    }

    getDonutStroke(score: number): string {
        // stroke-dasharray="70, 100" means 70 units filled, 30 units empty (assuming circumference ~100)
        return `${score}, 100`;
    }
}
