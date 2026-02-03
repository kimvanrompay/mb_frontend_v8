import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    Candidate,
    CandidateDetail,
    CandidatesResponse,
    CandidateResponse,
    CreateCandidateRequest,
    InviteCandidateRequest,
    CheckEmailResponse
} from '../models/candidate.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CandidateService {
    private apiUrl = `${environment.apiUrl}/candidates`;

    constructor(private http: HttpClient) { }

    /**
     * GET /api/v1/candidates - List all candidates
     * @param status Optional filter by status
     */
    getCandidates(status?: string): Observable<Candidate[]> {
        let params = new HttpParams();
        if (status) {
            params = params.set('status', status);
        }

        return this.http.get<CandidatesResponse>(this.apiUrl, { params }).pipe(
            map(response => response.candidates || [])
        );
    }

    /**
     * GET /api/v1/candidates - Get recent candidates
     * Note: Backend doesn't have a dedicated /recent endpoint,
     * so we fetch all and sort by created_at on frontend
     */
    getRecentCandidates(limit: number = 3): Observable<Candidate[]> {
        return this.getCandidates().pipe(
            map(candidates => {
                // Sort by created_at descending (most recent first)
                return candidates
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .slice(0, limit);
            })
        );
    }

    /**
     * GET /api/v1/candidates/:id - Get candidate details
     */
    getCandidate(id: string): Observable<CandidateDetail> {
        return this.http.get<CandidateResponse>(`${this.apiUrl}/${id}`).pipe(
            map(response => response.candidate)
        );
    }

    /**
     * POST /api/v1/candidates - Create new candidate
     */
    createCandidate(request: CreateCandidateRequest): Observable<Candidate> {
        return this.http.post<CandidateResponse>(this.apiUrl, request).pipe(
            map(response => response.candidate)
        );
    }

    /**
     * PATCH /api/v1/candidates/:id - Update candidate
     */
    updateCandidate(id: string, request: Partial<CreateCandidateRequest>): Observable<Candidate> {
        return this.http.patch<CandidateResponse>(`${this.apiUrl}/${id}`, request).pipe(
            map(response => response.candidate)
        );
    }

    /**
     * DELETE /api/v1/candidates/:id - Delete candidate
     */
    deleteCandidate(id: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
    }

    /**
     * GET /api/v1/candidates/check_email - Check if email exists
     */
    checkEmail(email: string): Observable<CheckEmailResponse> {
        const params = new HttpParams().set('email', email);
        return this.http.get<CheckEmailResponse>(`${this.apiUrl}/check_email`, { params });
    }

    /**
     * POST /api/v1/candidates/invite - Invite candidate to apply
     */
    inviteCandidate(request: InviteCandidateRequest): Observable<{ candidate_id: string; invitation_sent: boolean; message: string }> {
        return this.http.post<{ candidate_id: string; invitation_sent: boolean; message: string }>(
            `${this.apiUrl}/invite`,
            request
        );
    }

    /**
     * POST /api/v1/candidates/:id/resend_invitation - Resend invitation
     */
    resendInvitation(id: string): Observable<{ invitation_sent: boolean; message: string }> {
        return this.http.post<{ invitation_sent: boolean; message: string }>(
            `${this.apiUrl}/${id}/resend_invitation`,
            {}
        );
    }
}
