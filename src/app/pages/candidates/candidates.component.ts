import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Candidate } from '../../models/candidate.model';
import { CandidateService } from '../../services/candidate.service';

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
    sortBy: 'updated' | 'name' | 'applications' | 'created' = 'updated';

    // For invite modal
    isInviteModalOpen = false;
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
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadCandidates();
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
            switch (this.sortBy) {
                case 'updated':
                    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
                case 'name':
                    return a.full_name.localeCompare(b.full_name);
                case 'applications':
                    return b.applications_count - a.applications_count;
                case 'created':
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                default:
                    return 0;
            }
        });
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
    }

    inviteCandidate() {
        if (!this.inviteForm.first_name || !this.inviteForm.last_name || !this.inviteForm.email || !this.inviteForm.job_id) {
            alert('Please fill in all required fields');
            return;
        }

        this.candidateService.inviteCandidate(this.inviteForm).subscribe({
            next: (response) => {
                alert(response.message);
                this.closeInviteModal();
                this.loadCandidates();
            },
            error: (err) => {
                console.error('Error inviting candidate:', err);
                alert('Failed to invite candidate. Please try again.');
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
