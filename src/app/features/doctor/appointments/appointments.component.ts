import { Component, OnInit } from '@angular/core';
import { DoctorService, Appointment } from '../doctor.service';

type StatusFilter = 'ALL' | 'CONFIRMED' | 'PENDING' | 'BOOKED' | 'CANCELLED';
type DateFilter = 'ALL' | 'TODAY' | 'UPCOMING' | 'PAST';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {
  // data
  appointments: Appointment[] = [];

  // ui state
  loading = true;
  error: string | null = null;

  // filters
  searchTerm = '';
  status: StatusFilter = 'ALL';        // ✅ fixed (no ternary)
  dateFilter: DateFilter = 'UPCOMING'; // default

  // sorting
  sortKey: 'date' | 'patientName' = 'date';
  sortAsc: boolean = true;

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    this.loading = true;
    this.error = null;

    this.doctorService.getAppointments().subscribe({
      next: (data) => {
        this.appointments = Array.isArray(data) ? data : [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load appointments.';
        this.loading = false;
      }
    });
  }

  cancel(apptId: number) {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    this.doctorService.cancelAppointment(apptId).subscribe({
      next: () => {
        this.fetch();
      },
      error: (err) => {
        console.error(err);
        alert('Cancel failed.');
      }
    });
  }

  // computed view
  get view(): Appointment[] {
    let rows = [...this.appointments];

    // text search (by patient)
    if (this.searchTerm.trim()) {
      const q = this.searchTerm.toLowerCase();
      rows = rows.filter(a => (a.patientName || '').toLowerCase().includes(q));
    }

    // status filter
    if (this.status !== 'ALL') {
      rows = rows.filter(a => a.status === this.status || (this.status === 'PENDING' && a.status === 'BOOKED'));
    }

    // date filter
    const todayStr = this.toDateString(new Date());
    if (this.dateFilter !== 'ALL') {
      rows = rows.filter(a => {
        const d = a.date; // expected "YYYY-MM-DD"
        if (!d) return false;
        if (this.dateFilter === 'TODAY') return d === todayStr;
        if (this.dateFilter === 'UPCOMING') return d >= todayStr;
        if (this.dateFilter === 'PAST') return d < todayStr;
        return true;
      });
    }

    // sort
    rows.sort((a, b) => {
      let cmp = 0;
      if (this.sortKey === 'date') {
        const aKey = `${a.date ?? ''} ${a.startTime ?? ''}`;
        const bKey = `${b.date ?? ''} ${b.startTime ?? ''}`;
        cmp = aKey.localeCompare(bKey);
      } else {
        cmp = (a.patientName ?? '').localeCompare(b.patientName ?? '');
      }
      return this.sortAsc ? cmp : -cmp;
    });

    return rows;
  }

  setStatusFilter(s: StatusFilter) { this.status = s; }
  setDateFilter(d: DateFilter) { this.dateFilter = d; }

  toggleSort(key: 'date' | 'patientName') {
    if (this.sortKey === key) this.sortAsc = !this.sortAsc;
    else { this.sortKey = key; this.sortAsc = true; }
  }

  // helpers
  private toDateString(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}
