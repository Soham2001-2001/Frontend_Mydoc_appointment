import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Specialization { id: number; name: string; }

export interface Doctor {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialization?: Specialization;
}

export interface DoctorCreate {
  name: string;
  email: string;
  phone: string;
  password: string;          // required on create
  specializationId: number;  // required on create
}

export interface DoctorUpdate {
  name?: string;
  email?: string;
  phone?: string;
  password: string;          // required on update (backend demands not blank)
  specializationId?: number;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  // Specializations
  getSpecializations(): Observable<Specialization[]> {
    return this.http.get<Specialization[]>(`${this.apiUrl}/specializations`);
  }
  addSpecialization(req: { name: string }): Observable<Specialization> {
    return this.http.post<Specialization>(`${this.apiUrl}/specializations`, req);
  }
  deleteSpecialization(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/specializations/${id}`);
  }

  // Doctors
  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/doctors`);
  }
  getDoctor(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/doctors/${id}`);
  }
  addDoctor(data: DoctorCreate): Observable<Doctor> {
    const body = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      specializationId: data.specializationId
    };
    return this.http.post<Doctor>(`${this.apiUrl}/doctors`, body);
  }
  updateDoctor(id: number, data: DoctorUpdate): Observable<Doctor> {
    const body: any = {
      password: data.password  // <- always send (required by backend)
    };
    if (data.name !== undefined) body.name = data.name;
    if (data.email !== undefined) body.email = data.email;
    if (data.phone !== undefined) body.phone = data.phone;
    if (data.specializationId !== undefined) body.specializationId = data.specializationId;
    return this.http.put<Doctor>(`${this.apiUrl}/doctors/${id}`, body);
  }
  deleteDoctor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/doctors/${id}`);
  }
}
