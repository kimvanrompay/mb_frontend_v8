import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AssessmentStats } from '../models/assessment.model';

@Injectable({
    providedIn: 'root'
})
export class AssessmentService {
    private readonly API_URL = 'https://api.meribas.app/api/v1';

    constructor(private http: HttpClient) { }

    getStats(): Observable<AssessmentStats> {
        return this.http.get<AssessmentStats>(`${this.API_URL}/assessment_invitations/stats`);
    }
}
