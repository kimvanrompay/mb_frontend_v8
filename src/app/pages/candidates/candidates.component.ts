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

    sortOptions: Array<'updated' | 'name' | 'applications' | 'created' | 'status' | 'source' | 'email' | 'expectation' | 'values' | 'potential' | 'skills'> = [
        'updated', 'name', 'applications', 'created', 'expectation', 'values', 'potential', 'skills'
    ];

    statusOptions = ['all', 'new', 'in_process', 'hired', 'rejected'];

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


    onCardClick(candidate: Candidate) {
        this.router.navigate(['/candidates', candidate.id]);
    }

    getStatusBadgeClass(status: string): string {
        switch (status) {
            case 'new':
                return 'bg-blue-50 text-blue-700 border border-blue-100';
            case 'in_process':
                return 'bg-amber-50 text-amber-700 border border-amber-100';
            case 'hired':
                return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
            case 'rejected':
                return 'bg-red-50 text-red-700 border border-red-100';
            default:
                return 'bg-gray-50 text-gray-700 border border-gray-100';
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
