import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { PatientService } from '../services/patient.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class PatientDashboardComponent implements OnInit {
  patientId!: number;

  // Overview header data
  today = new Date();

  // Whether a child route (appointments/book/profile) is currently active
  childActive = false;

  // KPI + preview data
  loading = true;
  errorMsg: string | null = null;
  kpis: any = {};
  apptsPreview: any[] = [];

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private patient: PatientService
  ) {}

  ngOnInit(): void {
    this.patientId = this.auth.getReferenceId()!;

    // Listen to route changes to know when to show overview vs child pages
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        const child = this.route.firstChild?.snapshot?.routeConfig?.path ?? '';
        // When there is a concrete child path like 'appointments' | 'book' | 'profile',
        // we consider a child active and hide the overview.
        this.childActive = !!child;
      });

    // Also compute once at load (in case the first event already happened)
    const first = this.route.firstChild?.snapshot?.routeConfig?.path ?? '';
    this.childActive = !!first;

    // Load overview data (safe even if hidden; quick and cheap)
    this.loadOverviewData();
  }

  private loadOverviewData(): void {
    this.loading = true;
    this.errorMsg = null;

    // Dashboard KPIs
    this.patient.getDashboard(this.patientId).subscribe({
      next: (data) => {
        this.kpis = {
          nextAppointment: data?.nextAppointment ?? null,
          upcomingCount: data?.upcomingCount ?? 0,
          completedCount: data?.completedCount ?? 0
        };
      },
      error: () => (this.errorMsg = 'Failed to load dashboard')
    });

    // Appointments preview (server infers patient from JWT)
    this.patient.getAppointments().subscribe({
      next: (rows) => {
        const sorted = (rows || []).sort((a: any, b: any) =>
          (`${a.date} ${a.startTime}`).localeCompare(`${b.date} ${b.startTime}`)
        );
        const today = new Date().toISOString().slice(0, 10);
        this.apptsPreview = sorted.filter((x: any) => x.date >= today).slice(0, 5);
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
