import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

/* ---------- Types ---------- */
export interface Specialization {
  id: number;
  name: string;
}

export interface Doctor {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialization?: Specialization | string;
}

export interface AvailabilitySlot {
  id: number;
  date: string;       // YYYY-MM-DD
  startTime: string;  // HH:mm or HH:mm:ss
  endTime: string;    // HH:mm or HH:mm:ss
  available?: boolean;
}

export interface PatientProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob?: string;                               // ISO date
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | '';  // optional
  address?: string;
}

export interface Appointment {
  id: number;
  patientName?: string;
  doctorName?: string;
  date: string;       // YYYY-MM-DD
  startTime: string;  // HH:mm or HH:mm:ss
  endTime: string;    // HH:mm or HH:mm:ss
  status: 'PENDING' | 'BOOKED' | 'CONFIRMED' | 'CANCELLED';
}

export interface BookAppointmentPayload {
  doctorId: number;
  availabilityId: number;
}

export interface ReschedulePayload {
  appointmentId: number;
  newAvailabilityId: number;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword?: string;
}

/* ---------- Service ---------- */
@Injectable({ providedIn: 'root' })
export class PatientService {
  private apiUrl = `${environment.apiUrl}/patient`;

  constructor(private http: HttpClient) {}

  // ----- Discovery -----
  getSpecializations(): Observable<Specialization[]> {
    return this.http.get<Specialization[]>(`${this.apiUrl}/specializations`);
  }

  getDoctorsBySpecialization(specId: number): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/specializations/${specId}/doctors`);
  }

  getDoctorAvailabilities(doctorId: number): Observable<AvailabilitySlot[]> {
    return this.http.get<AvailabilitySlot[]>(`${this.apiUrl}/doctors/${doctorId}/availabilities`);
  }

  // ----- Dashboard -----
  getDashboard(patientId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${patientId}/dashboard`);
  }

  // ----- Appointments -----
  bookAppointment(patientId: number, payload: BookAppointmentPayload): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/${patientId}/appointments`, payload);
  }

  getAppointments(): Observable<Appointment[]> {
    // uses JWT to infer patient from token (no id in URL)
    return this.http.get<Appointment[]>(`${this.apiUrl}/appointments`);
  }

  cancelAppointment(patientId: number, appointmentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${patientId}/appointments/${appointmentId}`);
  }

  rescheduleAppointment(patientId: number, payload: ReschedulePayload): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${patientId}/appointments/reschedule`, payload);
  }

  // ----- Profile -----
  getProfile(patientId: number): Observable<PatientProfile> {
    return this.http.get<PatientProfile>(`${this.apiUrl}/${patientId}/profile`);
  }

  updateProfile(patientId: number, body: Partial<PatientProfile>): Observable<PatientProfile> {
    return this.http.put<PatientProfile>(`${this.apiUrl}/${patientId}/profile`, body);
  }

  // ----- Change Password -----
  changePassword(patientId: number, body: ChangePasswordPayload): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${patientId}/password`, body);
  }
}
