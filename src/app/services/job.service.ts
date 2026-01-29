import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job, JobResponse, JobsResponse } from '../models/job.model';

@Injectable({
    providedIn: 'root'
})
export class JobService {
    private readonly API_URL = 'https://api.meribas.app/api/v1';

    constructor(private http: HttpClient) { }

    /**
     * Fetch all jobs
     * @param status Optional filter by status ('open', 'closed', etc.)
     */
    getJobs(status?: string): Observable<JobsResponse> {
        const params: any = {};
        if (status) {
            params.status = status;
        }
        return this.http.get<JobsResponse>(`${this.API_URL}/jobs`, { params });
    }

    /**
     * Get a single job by ID
     * @param id Job ID
     */
    getJob(id: number): Observable<JobResponse> {
        return this.http.get<JobResponse>(`${this.API_URL}/jobs/${id}`);
    }

    /**
     * Create a new job
     * @param job Job data
     */
    createJob(job: Partial<Job>): Observable<JobResponse> {
        return this.http.post<JobResponse>(`${this.API_URL}/jobs`, { job });
    }

    /**
     * Update an existing job
     * @param id Job ID
     * @param job Partial job data to update
     */
    updateJob(id: number, job: Partial<Job>): Observable<JobResponse> {
        return this.http.patch<JobResponse>(`${this.API_URL}/jobs/${id}`, { job });
    }

    /**
     * Close a job
     * @param id Job ID
     */
    closeJob(id: number): Observable<JobResponse> {
        return this.http.post<JobResponse>(`${this.API_URL}/jobs/${id}/close`, {});
    }

    /**
     * Reopen a job
     * @param id Job ID
     */
    reopenJob(id: number): Observable<JobResponse> {
        return this.http.post<JobResponse>(`${this.API_URL}/jobs/${id}/reopen`, {});
    }

    /**
     * Mark a job as filled
     * @param id Job ID
     */
    markJobFilled(id: number): Observable<JobResponse> {
        return this.http.post<JobResponse>(`${this.API_URL}/jobs/${id}/mark_filled`, {});
    }
}
