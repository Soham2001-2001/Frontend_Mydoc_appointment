import { Component, OnInit } from '@angular/core';
import { DoctorService, AvailabilitySlot } from '../doctor.service';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html'
})
export class AvailabilityComponent implements OnInit {
  availability: AvailabilitySlot[] = [];
  newSlot = { date: '', startTime: '', endTime: '' };
  loading = true;

  // Dropdown options
  timeSlots: string[] = [];

  constructor(private doctorService: DoctorService) {}

  ngOnInit() {
    this.generateTimeSlots();
    this.loadAvailability();
  }

  // Generate every 30 min slot for dropdown
  generateTimeSlots() {
    const times: string[] = [];
    const format = (h: number, m: number) => {
      const hour = h % 12 || 12;
      const ampm = h < 12 ? 'AM' : 'PM';
      return `${hour}:${m === 0 ? '00' : '30'} ${ampm}`;
    };

    for (let h = 0; h < 24; h++) {
      times.push(format(h, 0));
      times.push(format(h, 30));
    }

    this.timeSlots = times;
  }

  // Load doctor’s availability
  loadAvailability() {
    this.doctorService.getAvailability().subscribe({
      next: (res) => {
        this.availability = res;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  // Save availability
  saveAvailability() {
    this.doctorService.saveAvailability(this.newSlot).subscribe({
      next: () => {
        this.newSlot = { date: '', startTime: '', endTime: '' };
        this.loadAvailability();
      },
      error: (err) => console.error('Save availability error', err),
    });
  }

  // Delete slot
  deleteSlot(id?: number) {
    if (!id) return;
    this.doctorService.deleteAvailability(id).subscribe({
      next: () => this.loadAvailability(),
      error: (err) => console.error('Delete slot error', err),
    });
  }
}
