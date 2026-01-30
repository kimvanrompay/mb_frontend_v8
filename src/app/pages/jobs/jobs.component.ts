import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Job } from '../../models/job.model';
import { JobService } from '../../services/job.service';

@Component({
    selector: 'app-jobs',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './jobs.component.html',
    styleUrl: './jobs.component.css'
})
export class JobsComponent implements OnInit {
    jobs: Job[] = [];
    filteredJobs: Job[] = [];
    loading = false;
    error: string | null = null;

    searchQuery = '';
    statusFilter: 'all' | 'open' | 'closed' | 'filled' = 'all';
    departmentFilter = 'all';
    sortBy: 'updated' | 'title' | 'applications' | 'deadline' = 'updated';

    departments: string[] = [];

    constructor(private jobService: JobService) { }

    ngOnInit() {
        this.loadJobs();
    }

    loadJobs() {
        this.loading = true;
        this.error = null;

        const statusParam = this.statusFilter === 'all' ? undefined : this.statusFilter;

        this.jobService.getJobs(statusParam).subscribe({
            next: (jobs) => {
                this.jobs = jobs;
                this.extractDepartments();
                this.applyFilters();
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Failed to load jobs. Please try again.';
                this.loading = false;
                console.error('Error loading jobs:', err);
            }
        });
    }

    extractDepartments() {
        const deptSet = new Set(this.jobs.map(j => j.department).filter(d => d));
        this.departments = Array.from(deptSet).sort();
    }

    applyFilters() {
        this.filteredJobs = this.jobs.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                (job.description && job.description.toLowerCase().includes(this.searchQuery.toLowerCase()));
            const matchesStatus = this.statusFilter === 'all' || job.status === this.statusFilter;
            const matchesDepartment = this.departmentFilter === 'all' || job.department === this.departmentFilter;

            return matchesSearch && matchesStatus && matchesDepartment;
        });

        // Apply sorting
        this.filteredJobs.sort((a, b) => {
            switch (this.sortBy) {
                case 'updated':
                    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'applications':
                    return b.total_applications - a.total_applications;
                case 'deadline':
                    if (!a.deadline && !b.deadline) return 0;
                    if (!a.deadline) return 1;
                    if (!b.deadline) return -1;
                    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
                default:
                    return 0;
            }
        });
    }

    getStatusBadgeClass(status: string): string {
        switch (status) {
            case 'open':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'closed':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'filled':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    }

    getTimeAgo(date: string): string {
        const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

        if (seconds < 60) return `Updated ${seconds}s ago`;
        if (seconds < 3600) return `Updated ${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `Updated ${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `Updated ${Math.floor(seconds / 86400)}d ago`;
        return `Updated ${Math.floor(seconds / 604800)}w ago`;
    }

    getActivityData(job: Job): number[] {
        // Generate mock activity data based on applications
        // In real implementation, this would come from API
        const dailyAvg = job.total_applications / 7;
        return Array.from({ length: 7 }, () => Math.floor(Math.random() * dailyAvg * 2));
    }

    closeJob(job: Job, event: Event) {
        event.stopPropagation();
        if (confirm(`Close position "${job.title}"? This will stop accepting new applications.`)) {
            this.jobService.closeJob(job.id).subscribe({
                next: () => this.loadJobs(),
                error: (err) => console.error('Error closing job:', err)
            });
        }
    }

    reopenJob(job: Job, event: Event) {
        event.stopPropagation();
        this.jobService.reopenJob(job.id).subscribe({
            next: () => this.loadJobs(),
            error: (err) => console.error('Error reopening job:', err)
        });
    }

    markFilled(job: Job, event: Event) {
        event.stopPropagation();
        if (confirm(`Mark "${job.title}" as filled?`)) {
            this.jobService.markFilled(job.id).subscribe({
                next: () => this.loadJobs(),
                error: (err) => console.error('Error marking filled:', err)
            });
        }
    }
}
