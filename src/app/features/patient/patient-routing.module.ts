import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientDashboardComponent } from './dashboard/dashboard.component';
import { PatientAppointmentsComponent } from './pages/patient-appointments.component';
import { PatientBookComponent } from './pages/patient-book.component';
import { PatientProfileComponent } from './pages/patient-profile.component';

const routes: Routes = [
  {
    path: '',
    component: PatientDashboardComponent,
    children: [
      { path: '', redirectTo: 'appointments', pathMatch: 'full' },
      { path: 'appointments', component: PatientAppointmentsComponent },
      { path: 'book', component: PatientBookComponent },
      { path: 'profile', component: PatientProfileComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule {}
