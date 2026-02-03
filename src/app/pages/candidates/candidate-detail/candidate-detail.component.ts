import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CandidateService } from '../../../services/candidate.service';
import { CandidateDetail } from '../../../models/candidate.model';

@Component({
    selector: 'app-candidate-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './candidate-detail.component.html',
    styleUrl: './candidate-detail.component.css'
})
export class CandidateDetailComponent implements OnInit {
    candidate: CandidateDetail | null = null;
    loading = true;
    error: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private candidateService: CandidateService
    ) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadCandidate(parseInt(id));
        }
    }

    loadCandidate(id: number) {
        this.loading = true;
        this.error = null;

        this.candidateService.getCandidate(id).subscribe({
            next: (candidate) => {
                this.candidate = candidate;
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Failed to load candidate details';
                this.loading = false;
                console.error('Error loading candidate:', err);
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

    formatStatus(status: string): string {
        return status.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    formatSource(source: string): string {
        return source.charAt(0).toUpperCase() + source.slice(1);
    }

    formatDate(date: string): string {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatEventType(eventType: string): string {
        return eventType.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    hasMetadata(metadata: any): boolean {
        return metadata && Object.keys(metadata).length > 0;
    }
}
