import { Component, Input, OnInit } from '@angular/core';
import { PatientService } from '../services/patient.service';

@Component({
  selector: 'app-slot-booking',
  templateUrl: './slot-booking.component.html',
  styleUrls: ['./slot-booking.component.scss']
})
export class SlotBookingComponent implements OnInit {
  @Input() patientId!: number;
  @Input() doctorId!: number;

  slots: any[] = [];
  selectedSlot: any = null;
  loading = false;
  error: string | null = null;

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    if (this.doctorId) {
      this.loadSlots(this.doctorId);
    }
  }

  loadSlots(doctorId: number) {
    this.loading = true;
    this.error = null;
    this.patientService.getDoctorAvailabilities(doctorId).subscribe({
      next: (res) => {
        this.slots = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load slots';
        this.loading = false;
      }
    });
  }

  bookSlot(slot: any) {
    if (!this.patientId || !this.doctorId) return;

    const payload = {
      doctorId: this.doctorId,
      availabilityId: slot.id
    };

    this.patientService.bookAppointment(this.patientId, payload).subscribe({
      next: () => {
        alert('Appointment booked successfully!');
        this.selectedSlot = slot;
      },
      error: () => {
        alert('Failed to book slot.');
      }
    });
  }
}
