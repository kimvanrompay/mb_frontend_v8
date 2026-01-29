import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TenantResponse } from '../models/tenant.model';

@Injectable({
    providedIn: 'root'
})
export class TenantService {
    private readonly API_URL = 'https://api.meribas.app/api/v1';

    constructor(private http: HttpClient) { }

    getTenant(): Observable<TenantResponse> {
        return this.http.get<TenantResponse>(`${this.API_URL}/auth/tenant`);
    }
}
