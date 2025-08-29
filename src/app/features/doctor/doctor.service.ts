import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/core/auth.service';

// ------------------ MODELS ------------------
export interface Appointment {
  id: number;
  patientName: string;
  date: string;       // "YYYY-MM-DD"
  startTime: string;  // "HH:mm:ss" or "HH:mm"
  endTime: string;    // "HH:mm:ss" or "HH:mm"
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'BOOKED';
}

export interface AvailabilitySlot {
  id?: number;
  date: string;       // YYYY-MM-DD
  startTime: string;  // HH:mm
  endTime: string;    // HH:mm
}

export interface DoctorProfile {
  id: number;
  name: string;
  specialization: string;
  email: string;
  phone: string;
}

// ------------------ SERVICE ------------------
@Injectable({ providedIn: 'root' })
export class DoctorService {
  private api = `${environment.apiUrl}/doctor`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getDoctorId(): number {
    return this.auth.getReferenceId()!;
  }

  // ------------------ APPOINTMENTS ------------------
  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(
      `${this.api}/${this.getDoctorId()}/appointments`
    );
  }

  // ✅ Cancel an appointment
  cancelAppointment(appointmentId: number): Observable<Appointment> {
    return this.http.put<Appointment>(
      `${this.api}/appointments/${appointmentId}/cancel`,
      {}
    );
  }

  // ------------------ AVAILABILITY ------------------
  getAvailability(): Observable<AvailabilitySlot[]> {
    return this.http.get<AvailabilitySlot[]>(
      `${this.api}/${this.getDoctorId()}/availability`
    );
  }

  saveAvailability(slot: any): Observable<any> {
    const payload = {
      date: slot.date,                                // YYYY-MM-DD
      startTime: this.convertTo24Hour(slot.startTime),// HH:mm
      endTime: this.convertTo24Hour(slot.endTime)     // HH:mm
    };
    return this.http.post(`${this.api}/${this.getDoctorId()}/availability`, payload);
  }

  deleteAvailability(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.api}/${this.getDoctorId()}/availability/${id}`
    );
  }

  // ------------------ PROFILE ------------------
  getProfile(): Observable<DoctorProfile> {
    return this.http.get<DoctorProfile>(
      `${this.api}/${this.getDoctorId()}/profile`
    );
  }

  updateProfile(profile: DoctorProfile): Observable<DoctorProfile> {
    return this.http.put<DoctorProfile>(
      `${this.api}/${this.getDoctorId()}/profile`,
      profile
    );
  }

  // ✅ Convert "09:30 AM" → "09:30", "02:00 PM" → "14:00"
  private convertTo24Hour(time: string): string {
    if (!time) return '';
    const [t, modifier] = time.split(' ');
    let [hours, minutes] = t.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
  }
}
