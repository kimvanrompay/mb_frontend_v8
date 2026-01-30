import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Job, CreateJobRequest } from '../models/job.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class JobService {
    private apiUrl = `${environment.apiUrl}/jobs`;

    constructor(private http: HttpClient) { }

    /**
     * GET /api/v1/jobs - List all jobs
     * @param status Optional filter by status
     */
    getJobs(status?: 'open' | 'closed' | 'filled'): Observable<Job[]> {
        let params = new HttpParams();
        if (status) {
            params = params.set('status', status);
        }

        // Add cache-busting headers to prevent 304 responses
        const headers = {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        };

        return this.http.get<{ jobs: Job[] }>(this.apiUrl, { params, headers }).pipe(
            tap(response => console.log('Jobs API response:', response)),
            map(response => response.jobs || []),
            catchError(error => {
                console.error('Jobs API error:', error);
                throw error;
            })
        );
    }

    /**
     * GET /api/v1/jobs/:id - Get job details
     */
    getJob(id: string): Observable<Job> {
        return this.http.get<Job>(`${this.apiUrl}/${id}`);
    }

    /**
     * POST /api/v1/jobs - Create job (Admin only)
     */
    createJob(job: CreateJobRequest): Observable<Job> {
        return this.http.post<Job>(this.apiUrl, job);
    }

    /**
     * PATCH /api/v1/jobs/:id - Update job (Admin only)
     */
    updateJob(id: string, job: Partial<CreateJobRequest>): Observable<Job> {
        return this.http.patch<Job>(`${this.apiUrl}/${id}`, job);
    }

    /**
     * POST /api/v1/jobs/:id/close - Close job (Admin only)
     */
    closeJob(id: string): Observable<Job> {
        return this.http.post<Job>(`${this.apiUrl}/${id}/close`, {});
    }

    /**
     * POST /api/v1/jobs/:id/reopen - Reopen job
     */
    reopenJob(id: string): Observable<Job> {
        return this.http.post<Job>(`${this.apiUrl}/${id}/reopen`, {});
    }

    /**
     * POST /api/v1/jobs/:id/mark_filled - Mark as filled (Admin only)
     */
    markFilled(id: string): Observable<Job> {
        return this.http.post<Job>(`${this.apiUrl}/${id}/mark_filled`, {});
    }

    /**
     * POST /api/v1/jobs/:id/star - Star job
     */
    starJob(id: string): Observable<{ job: Job; message: string }> {
        return this.http.post<{ job: Job; message: string }>(`${this.apiUrl}/${id}/star`, {});
    }

    /**
     * POST /api/v1/jobs/:id/unstar - Unstar job
     */
    unstarJob(id: string): Observable<{ job: Job; message: string }> {
        return this.http.post<{ job: Job; message: string }>(`${this.apiUrl}/${id}/unstar`, {});
    }
}
