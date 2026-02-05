import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Candidate } from '../../models/candidate.model';
import { CandidateService } from '../../services/candidate.service';
import { JobService } from '../../services/job.service';

@Component({
    selector: 'app-candidates',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './candidates.component.html',
    styleUrl: './candidates.component.css'
})
export class CandidatesComponent implements OnInit {
    candidates: Candidate[] = [];
    filteredCandidates: Candidate[] = [];
    loading = false;
    error: string | null = null;

    searchQuery = '';
    statusFilter = 'all';
    sourceFilter = 'all';
    sortBy: 'updated' | 'name' | 'applications' | 'created' | 'status' | 'source' | 'email' | 'expectation' | 'values' | 'potential' | 'skills' = 'updated';
    sortDirection: 'asc' | 'desc' = 'desc';

    // For invite modal
    isInviteModalOpen = false;
    jobs: any[] = [];
    emailCheckResult: any = null;
    checkingEmail = false;
    inviteForm = {
        job_id: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        preferred_language: 'en'
    };

    constructor(
        private candidateService: CandidateService,
        private jobService: JobService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadCandidates();
        this.loadJobs();
    }

    loadJobs() {
        this.jobService.getJobs('open').subscribe({
            next: (jobs) => {
                this.jobs = jobs;
            },
            error: (err) => {
                console.error('Error loading jobs:', err);
                // Silently fail - jobs will just show empty dropdown
            }
        });
    }

    loadCandidates() {
        this.loading = true;
        this.error = null;
        this.cdr.detectChanges();

        const statusParam = this.statusFilter === 'all' ? undefined : this.statusFilter;

        this.candidateService.getCandidates(statusParam).subscribe({
            next: (candidates) => {
                this.candidates = candidates;
                this.applyFilters();
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.candidates = [];
                this.filteredCandidates = [];
                this.error = 'Failed to load candidates. Please try again.';
                this.loading = false;
                this.cdr.detectChanges();
                console.error('Error loading candidates:', err);
            }
        });
    }

    applyFilters() {
        this.filteredCandidates = this.candidates.filter(candidate => {
            const matchesSearch =
                candidate.full_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                candidate.email.toLowerCase().includes(this.searchQuery.toLowerCase());

            const matchesStatus = this.statusFilter === 'all' || candidate.status === this.statusFilter;
            const matchesSource = this.sourceFilter === 'all' || candidate.source === this.sourceFilter;

            return matchesSearch && matchesStatus && matchesSource;
        });

        // Apply sorting
        this.filteredCandidates.sort((a, b) => {
            let comparison = 0;

            switch (this.sortBy) {
                case 'updated':
                    comparison = new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
                    break;
                case 'created':
                    comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                    break;
                case 'name':
                    comparison = a.full_name.localeCompare(b.full_name);
                    break;
                case 'email':
                    comparison = a.email.localeCompare(b.email);
                    break;
                case 'applications':
                    comparison = b.applications_count - a.applications_count;
                    break;
                case 'status':
                    comparison = a.status.localeCompare(b.status);
                    break;
                case 'source':
                    comparison = a.source.localeCompare(b.source);
                    break;
                case 'expectation':
                    comparison = (b.expectation_match || 0) - (a.expectation_match || 0);
                    break;
                case 'values':
                    comparison = (b.values_match || 0) - (a.values_match || 0);
                    break;
                case 'potential':
                    comparison = (b.potential_match || 0) - (a.potential_match || 0);
                    break;
                case 'skills':
                    comparison = (b.skills_match || 0) - (a.skills_match || 0);
                    break;
                default:
                    comparison = 0;
            }

            return this.sortDirection === 'asc' ? comparison : -comparison;
        });
    }

    sortByColumn(column: 'updated' | 'name' | 'applications' | 'created' | 'status' | 'source' | 'email' | 'expectation' | 'values' | 'potential' | 'skills') {
        if (this.sortBy === column) {
            // Toggle direction if clicking the same column
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            // Set new column and default to descending (or ascending for name/email)
            this.sortBy = column;
            this.sortDirection = (column === 'name' || column === 'email') ? 'asc' : 'desc';
        }
        this.applyFilters();
    }

    // Helper to generate heatmap background color based on score (0-100)
    // Using a minimal, dark-green driven monochrome scale for all metrics
    getScoreStyle(score: number | null | undefined, type: 'green' | 'blue' | 'purple' | 'orange'): { [key: string]: string } {
        if (score === null || score === undefined) {
            return { 'background-color': '#f9fafb', 'color': '#9ca3af' }; // Gray-50 background, Gray-400 text
        }

        // Base Color: Emerald-900 (6, 78, 59)
        // We will interpolate from White (255, 255, 255) to Emerald-900
        // But to keep it readable, we might want a lighter "full score" color or just adjust opacity.
        // Actually, for a heatmap, usually lighter is lower, darker is higher.

        // Let's use a specialized green scale for each "type" if we want subtle differentiation, 
        // OR just one unified Dark Green scale as requested ("accents need to be dark green").
        // I will use a unified Emerald scale for all match types to be perfectly minimal.

        // RGB for Emerald-900: 6, 78, 59
        const r_target = 6, g_target = 78, b_target = 59;

        // Start from (255, 255, 255)
        // Calculate intensity based on score. 
        // Score 0 -> White
        // Score 100 -> Emerald-900 
        // We'll use a slightly lighter max for better text contrast if needed, but Emerald-900 is very dark.
        // Let's go to Emerald-800: 6, 95, 70 usually.
        // Let's stick to the math:

        const intensity = score / 100;
        const r = 255 - (255 - r_target) * intensity;
        const g = 255 - (255 - g_target) * intensity;
        const b = 255 - (255 - b_target) * intensity;

        return {
            'background-color': `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`,
            // White text if efficient contrast, else Black/Dark Gray
            // Threshold around 50-60% usually flips contrast for dark greens
            'color': score > 50 ? '#ffffff' : '#064e3b' // Emerald-900 text for light backgrounds
        };
    }

    onCardClick(candidate: Candidate) {
        this.router.navigate(['/candidates', candidate.id]);
    }

    getStatusBadgeClass(status: string): string {
        switch (status) {
            case 'new':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'in_process':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'hired':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    }

    getSourceBadgeClass(source: string): string {
        switch (source) {
            case 'manual':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'invited':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'applied':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    }

    getTimeAgo(date: string): string {
        const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

        if (seconds < 60) return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return `${Math.floor(seconds / 604800)}w ago`;
    }

    formatStatus(status: string): string {
        return status.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    formatSource(source: string): string {
        return source.charAt(0).toUpperCase() + source.slice(1);
    }

    // Premium UI Helper Methods
    formatFilterValue(value: string): string {
        if (value === 'all') return 'All';
        return value.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    formatSortValue(value: string): string {
        switch (value) {
            case 'updated': return 'Last Updated';
            case 'name': return 'Name (A-Z)';
            case 'applications': return 'Applications';
            case 'created': return 'Date Added';
            default: return value;
        }
    }

    openInviteModal() {
        this.isInviteModalOpen = true;
        this.resetInviteForm();
    }

    closeInviteModal() {
        this.isInviteModalOpen = false;
        this.resetInviteForm();
    }

    resetInviteForm() {
        this.inviteForm = {
            job_id: '',
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            preferred_language: 'en'
        };
        this.emailCheckResult = null;
        this.checkingEmail = false;
    }

    checkCandidateEmail() {
        const email = this.inviteForm.email.trim();
        if (!email || !email.includes('@')) {
            this.emailCheckResult = null;
            return;
        }

        this.checkingEmail = true;
        this.candidateService.checkEmail(email).subscribe({
            next: (result) => {
                this.emailCheckResult = result;
                this.checkingEmail = false;
                
                // Pre-fill name if candidate exists
                if (result.exists && result.candidate) {
                    const parts = result.candidate.full_name.split(' ');
                    this.inviteForm.first_name = parts[0] || '';
                    this.inviteForm.last_name = parts.slice(1).join(' ') || '';
                }
            },
            error: (err) => {
                console.error('Error checking email:', err);
                this.emailCheckResult = null;
                this.checkingEmail = false;
            }
        });
    }

    inviteCandidate() {
        if (!this.inviteForm.first_name || !this.inviteForm.last_name || !this.inviteForm.email || !this.inviteForm.job_id) {
            alert('Please fill in all required fields');
            return;
        }

        // Check if candidate exists and cannot be invited
        if (this.emailCheckResult?.exists && !this.emailCheckResult.candidate.can_be_invited) {
            alert(`Cannot invite: Candidate already exists with status "${this.emailCheckResult.candidate.status}". Only candidates with status "new" or "rejected" can be invited.`);
            return;
        }

        this.candidateService.inviteCandidate(this.inviteForm).subscribe({
            next: (response) => {
                alert(`✅ ${response.message}\n\nThe candidate will receive an email with an invitation link.`);
                this.closeInviteModal();
                this.loadCandidates();
            },
            error: (err) => {
                console.error('Error inviting candidate:', err);
                const errorMessage = err.error?.error || 'Failed to invite candidate. Please try again.';
                alert(`❌ ${errorMessage}`);
            }
        });
    }

    resendInvitation(candidate: Candidate, event: Event) {
        event.stopPropagation();
        if (confirm(`Resend invitation to ${candidate.full_name}?`)) {
            this.candidateService.resendInvitation(candidate.id).subscribe({
                next: (response) => {
                    alert(response.message);
                },
                error: (err) => {
                    console.error('Error resending invitation:', err);
                    alert('Failed to resend invitation');
                }
            });
        }
    }

    deleteCandidate(candidate: Candidate, event: Event) {
        event.stopPropagation();
        if (confirm(`Delete ${candidate.full_name}? This action cannot be undone.`)) {
            this.candidateService.deleteCandidate(candidate.id).subscribe({
                next: () => {
                    this.loadCandidates();
                },
                error: (err) => {
                    console.error('Error deleting candidate:', err);
                    alert('Failed to delete candidate');
                }
            });
        }
    }
}
