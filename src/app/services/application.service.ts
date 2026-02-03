import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    Application,
    ApplicationDetail,
    ApplicationsResponse,
    ApplicationResponse,
    CreateApplicationRequest,
    HireRequest,
    RejectRequest
} from '../models/application.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApplicationService {
    private apiUrl = `${environment.apiUrl}/applications`;

    constructor(private http: HttpClient) { }

    /**
     * GET /api/v1/applications - List all applications
     * @param status Optional filter by status
     */
    getApplications(status?: string): Observable<Application[]> {
        let params = new HttpParams();
        if (status) {
            params = params.set('status', status);
        }

        return this.http.get<ApplicationsResponse>(this.apiUrl, { params }).pipe(
            map(response => response.applications || [])
        );
    }

    /**
     * Get count of pending applications (for dashboard)
     */
    getPendingCount(): Observable<number> {
        return this.getApplications('pending').pipe(
            map(applications => applications.length)
        );
    }

    /**
     * GET /api/v1/applications/:id - Get application details
     */
    getApplication(id: number): Observable<ApplicationDetail> {
        return this.http.get<ApplicationResponse>(`${this.apiUrl}/${id}`).pipe(
            map(response => response.application)
        );
    }

    /**
     * POST /api/v1/applications - Create application
     */
    createApplication(request: CreateApplicationRequest): Observable<ApplicationDetail> {
        return this.http.post<ApplicationResponse>(this.apiUrl, request).pipe(
            map(response => response.application)
        );
    }

    /**
     * POST /api/v1/applications/:id/start_review - Start reviewing application
     */
    startReview(id: number): Observable<Application> {
        return this.http.post<ApplicationResponse>(`${this.apiUrl}/${id}/start_review`, {}).pipe(
            map(response => response.application)
        );
    }

    /**
     * POST /api/v1/applications/:id/hire - Hire candidate (Admin only)
     */
    hire(id: number, request?: HireRequest): Observable<{ application: Application; employee: any; message: string }> {
        return this.http.post<{ application: Application; employee: any; message: string }>(
            `${this.apiUrl}/${id}/hire`,
            request || {}
        );
    }

    /**
     * POST /api/v1/applications/:id/reject - Reject candidate (Admin only)
     */
    reject(id: number, request?: RejectRequest): Observable<{ application: Application; message: string }> {
        return this.http.post<{ application: Application; message: string }>(
            `${this.apiUrl}/${id}/reject`,
            request || {}
        );
    }
}
