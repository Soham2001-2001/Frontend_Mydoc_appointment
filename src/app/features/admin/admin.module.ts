import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AdminRoutingModule } from './admin-routing.module';

import { AdminDashboardComponent } from './dashboard/dashboard.component';
import { DoctorsListComponent } from './doctors-list/doctors-list.component';
import { SpecializationsListComponent } from './specializations-list/specializations-list.component';
import { DoctorFormComponent } from './doctor-form/doctor-form.component'; // ✅ DECLARE

@NgModule({
  declarations: [
    AdminDashboardComponent,
    DoctorsListComponent,
    SpecializationsListComponent,
    DoctorFormComponent   // ✅ INCLUDED
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AdminRoutingModule
  ],
  exports: [AdminDashboardComponent]
})
export class AdminModule {}
