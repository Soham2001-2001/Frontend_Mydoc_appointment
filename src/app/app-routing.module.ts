import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { RoleGuard } from './core/role.guard';


const routes: Routes = [
  // ✅ Default landing page
  { path: '', component: HomeComponent, pathMatch: 'full' },

  // ✅ Lazy-loaded dashboards with guards
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.module').then(m => m.AdminModule),
    canActivate: [RoleGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'doctor',
    loadChildren: () =>
      import('./features/doctor/doctor.module').then(m => m.DoctorModule),
    canActivate: [RoleGuard],
    data: { role: 'DOCTOR' }
  },
  {
    path: 'patient',
    loadChildren: () =>
      import('./features/patient/patient.module').then(m => m.PatientModule),
    canActivate: [RoleGuard],
    data: { role: 'PATIENT' }
  },

  // ✅ Auth lazy-loaded
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then(m => m.AuthModule)
  },

  // ✅ Wildcard fallback
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
