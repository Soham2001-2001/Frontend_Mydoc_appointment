import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { PatientDashboardComponent } from './dashboard/dashboard.component';
import { PatientAppointmentsComponent } from './pages/patient-appointments.component';
import { PatientBookComponent } from './pages/patient-book.component';
import { PatientProfileComponent } from './pages/patient-profile.component';
import { PatientRoutingModule } from './patient-routing.module';
import { SlotBookingComponent } from './slot-booking/slot-booking.component';

@NgModule({
  declarations: [
    PatientDashboardComponent,
    PatientAppointmentsComponent,
    PatientBookComponent,
    PatientProfileComponent,
    SlotBookingComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PatientRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PatientModule {}
