import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './dashboard/dashboard.component';
import { DoctorsListComponent } from './doctors-list/doctors-list.component';
import { SpecializationsListComponent } from './specializations-list/specializations-list.component';
import { DoctorFormComponent } from './doctor-form/doctor-form.component'; // ✅ IMPORT

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      { path: '', redirectTo: 'doctors', pathMatch: 'full' },
      { path: 'doctors', component: DoctorsListComponent },
      { path: 'doctors/new', component: DoctorFormComponent },      // ✅ NOW RESOLVES
      { path: 'specializations', component: SpecializationsListComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
