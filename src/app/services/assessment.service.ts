import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AssessmentStats, TestCatalogResponse } from '../models/assessment.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AssessmentService {
    private apiUrl = `${environment.apiUrl}/assessment_invitations`;
    private catalogUrl = `${environment.apiUrl}/test_catalog`;

    constructor(private http: HttpClient) { }

    getStats(): Observable<AssessmentStats> {
        return this.http.get<AssessmentStats>(`${this.apiUrl}/stats`);
    }

    getTestCatalog(locale: string = 'en'): Observable<TestCatalogResponse> {
        return this.http.get<TestCatalogResponse>(this.catalogUrl, { params: { locale } });
    }
}
