import { Component, OnInit } from '@angular/core';
import { PatientService } from '../services/patient.service';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-patient-book',
  templateUrl: './patient-book.component.html',
  styleUrls: ['./patient-book.component.scss']
})
export class PatientBookComponent implements OnInit {
  specializations: any[] = [];
  doctors: any[] = [];
  slots: any[] = [];

  selectedSpec: number | null = null;
  selectedDoctor: number | null = null;
  selectedSlot: number | null = null;

  loading = false;
  message: string | null = null;

  // IMPORTANT: will be set from token
  patientId!: number;

  constructor(
    private patientService: PatientService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.patientId = this.auth.getReferenceId()!;
    this.loadSpecializations();
  }

  loadSpecializations() {
    this.patientService.getSpecializations().subscribe({
      next: (res) => (this.specializations = res),
      error: () => (this.message = '⚠️ Failed to load specializations')
    });
  }

  onSpecializationChange() {
    this.message = null;
    this.doctors = [];
    this.slots = [];
    this.selectedDoctor = null;
    this.selectedSlot = null;

    if (!this.selectedSpec) return;

    this.patientService.getDoctorsBySpecialization(this.selectedSpec).subscribe({
      next: (res) => (this.doctors = res),
      error: () => (this.message = '⚠️ Failed to load doctors')
    });
  }

  onDoctorChange() {
    this.message = null;
    this.slots = [];
    this.selectedSlot = null;

    if (!this.selectedDoctor) return;

    this.patientService.getDoctorAvailabilities(this.selectedDoctor).subscribe({
      next: (res) => (this.slots = res),
      error: () => (this.message = '⚠️ Failed to load slots')
    });
  }

  // ✅ Book for the LOGGED-IN patient
  bookAppointment() {
    this.message = null;
    if (!this.patientId) {
      this.message = '❌ You must be logged in as a patient to book.';
      return;
    }
    if (!this.selectedDoctor || !this.selectedSlot) {
      this.message = '⚠️ Please select a doctor and a slot.';
      return;
    }

    const payload = {
      doctorId: this.selectedDoctor,
      availabilityId: this.selectedSlot
    };

    this.loading = true;
    this.patientService.bookAppointment(this.patientId, payload).subscribe({
      next: () => {
        this.message = '✅ Appointment booked successfully!';
        this.loading = false;

        // reset selections
        this.selectedSpec = null;
        this.selectedDoctor = null;
        this.selectedSlot = null;
        this.doctors = [];
        this.slots = [];
      },
      error: () => {
        this.message = '❌ Failed to book appointment';
        this.loading = false;
      }
    });
  }
}
