import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { DoctorRoutingModule } from './doctor-routing.module';

import { DoctorDashboardComponent } from './dashboard/dashboard.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { AvailabilityComponent } from './availability/availability.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    DoctorDashboardComponent,
    AppointmentsComponent,
    AvailabilityComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,   // ✅ date pipe, ngClass
    FormsModule,    // ✅ ngModel
    RouterModule,
    DoctorRoutingModule
  ]
})
export class DoctorModule {}
