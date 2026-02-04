import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
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
    sortBy: 'updated' | 'name' | 'applications' | 'created' | 'status' | 'source' | 'email' | 'expectation' | 'values' | 'potential' | 'skills' = 'updated';
    sortDirection: 'asc' | 'desc' = 'desc';

    // For invite modal
    isInviteModalOpen = false;
    inviteForm = {
        job_id: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        preferred_language: 'nl'
    };

    constructor(
        private candidateService: CandidateService,
        private cdr: ChangeDetectorRef,
        private router: Router
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
    getScoreStyle(score: number | null | undefined, type: 'green' | 'blue' | 'purple' | 'orange'): { [key: string]: string } {
        if (score === null || score === undefined) {
            return { 'background-color': 'transparent' };
        }

        let r, g, b;
        // Palettes customized for soft, premium look
        switch (type) {
            case 'green': // Expectation - Emerald/Teal
                // Base: 16, 185, 129. Light: 255, 255, 255
                r = 16 + (255 - 16) * (1 - score / 100);
                g = 185 + (255 - 185) * (1 - score / 100);
                b = 129 + (255 - 129) * (1 - score / 100);
                break;
            case 'blue': // Values - Blue/Indigo
                // Base: 59, 130, 246
                r = 59 + (255 - 59) * (1 - score / 100);
                g = 130 + (255 - 130) * (1 - score / 100);
                b = 246 + (255 - 246) * (1 - score / 100);
                break;
            case 'purple': // Potential - Purple/Violet
                // Base: 139, 92, 246
                r = 139 + (255 - 139) * (1 - score / 100);
                g = 92 + (255 - 92) * (1 - score / 100);
                b = 246 + (255 - 246) * (1 - score / 100);
                break;
            case 'orange': // Skills - Orange/Amber
                // Base: 245, 158, 11
                r = 245 + (255 - 245) * (1 - score / 100);
                g = 158 + (255 - 158) * (1 - score / 100);
                b = 11 + (255 - 11) * (1 - score / 100);
                break;
        }

        // Return rgba with opacity that scales slightly with score for better visibility on low/high ends
        // But the math above already blends to white (255,255,255), so we can just use RGB.
        // To keep it "soft" like the example, we can ensure the lowest values are very light gray/white
        // and highest values are the deep color.

        return {
            'background-color': `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`,
            'color': score > 60 ? '#ffffff' : '#1f2937' // White text for dark backgrounds, dark text for light
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
