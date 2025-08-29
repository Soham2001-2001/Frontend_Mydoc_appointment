import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  // ✅ Login + Save Token, Role, ReferenceId
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.api}/login`, { email, password }).pipe(
      tap((response) => {
        if (response.token) this.saveToken(response.token);
        if (response.role) this.saveRole(response.role);
        if (response.referenceId) this.saveReferenceId(response.referenceId);
      })
    );
  }

  // ✅ Patient Registration
  registerPatient(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    dob?: string;
    gender?: string;
    address?: string;
  }): Observable<any> {
    return this.http.post(`${this.api}/register/patient`, data);
  }

  // ✅ LocalStorage helpers
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  saveRole(role: string) {
    localStorage.setItem('role', role);
  }

  saveReferenceId(id: number) {
    localStorage.setItem('referenceId', id.toString());
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getReferenceId(): number | null {
    const id = localStorage.getItem('referenceId');
    return id ? +id : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('referenceId');
  }
}
