import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CandidateService } from '../../../services/candidate.service';
import { CandidateDetail } from '../../../models/candidate.model';


@Component({
    selector: 'app-candidate-detail',
    standalone: true,
    imports: [
        CommonModule, 
        RouterModule
    ],
    templateUrl: './candidate-detail.component.html',
    styleUrl: './candidate-detail.component.css'
})
export class CandidateDetailComponent implements OnInit {
    candidate: CandidateDetail | null = null;
    loading = true;
    error: string | null = null;

    mriData: any = null;
    loadingMRI = true;

    constructor(
        private route: ActivatedRoute,
        private candidateService: CandidateService
    ) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadCandidate(id);
        } else {
            this.loading = false;
            this.error = 'No candidate ID provided.';
        }
    }

    loadCandidate(id: string) {
        this.loading = true;
        this.error = null;

        this.candidateService.getCandidate(id).subscribe({
            next: (candidate) => {
                this.candidate = candidate;
                this.loading = false;
                this.loadMRIData(id);
            },
            error: (err) => {
                console.error('Error loading candidate:', err);

                if (err.status === 404) {
                    this.error = 'Candidate not found. This candidate may have been deleted.';
                } else if (err.status === 500) {
                    this.error = 'Server error loading candidate details. The backend team has been notified. Please try again later or contact support.';
                } else if (err.status === 0) {
                    this.error = 'Unable to connect to the server. Please check your internet connection.';
                } else {
                    this.error = `Failed to load candidate details (Error ${err.status || 'Unknown'})`;
                }

                this.loading = false;
            }
        });
    }

    loadMRIData(id: string) {
        this.loadingMRI = true;
        
        this.candidateService.getCandidateMRI(id).subscribe({
            next: (data) => {
                this.mriData = data;
                this.loadingMRI = false;
            },
            error: (err) => {
                console.error('Error loading MRI data:', err);
                this.loadingMRI = false;
            }
        });
    }

}
