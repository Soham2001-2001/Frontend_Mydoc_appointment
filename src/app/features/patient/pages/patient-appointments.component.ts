import { Component, OnInit } from '@angular/core';
import { PatientService } from '../services/patient.service';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-patient-appointments',
  templateUrl: './patient-appointments.component.html',
  styleUrls: ['./patient-appointments.component.scss']
})
export class PatientAppointmentsComponent implements OnInit {
  patientId!: number;
  appointments: any[] = [];

  showRescheduleFor: number | null = null;
  doctorAvailabilities: any[] = [];
  selectedAvailability: number | null = null;

  constructor(
    private patientService: PatientService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.patientId = this.auth.getReferenceId()!;
    this.loadAppointments();
  }

  loadAppointments() {
    this.patientService.getAppointments().subscribe({
      next: (res) => {
        console.log('appointments ->', res); // DEBUG
        this.appointments = res;
      },
      error: (err) => console.error('Error loading appointments', err)
    });
  }

  cancelAppointment(apptId: number) {
    this.patientService.cancelAppointment(this.patientId, apptId).subscribe({
      next: () => this.loadAppointments(),
      error: (err) => console.error('Cancel failed', err)
    });
  }

  showRescheduleForAppt(appt: any) {
    this.showRescheduleFor = appt.id;
    this.selectedAvailability = null;

    // if backend DTO includes doctorId
    this.patientService.getDoctorAvailabilities(appt.doctorId).subscribe({
      next: (res) => (this.doctorAvailabilities = res),
      error: (err) => console.error('Error fetching availabilities', err)
    });
  }

  confirmReschedule(apptId: number) {
    if (!this.selectedAvailability) return;

    const payload = {
      appointmentId: apptId,
      newAvailabilityId: this.selectedAvailability
    };

    this.patientService.rescheduleAppointment(this.patientId, payload).subscribe({
      next: () => {
        this.showRescheduleFor = null;
        this.loadAppointments();
      },
      error: (err) => console.error('Reschedule failed', err)
    });
  }

  closeReschedule() {
    this.showRescheduleFor = null;
    this.selectedAvailability = null;
    this.doctorAvailabilities = [];
  }
}
