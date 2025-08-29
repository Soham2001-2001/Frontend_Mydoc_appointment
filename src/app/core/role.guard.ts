import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expected = (route.data['role'] || '').toUpperCase();
    const role = (this.auth.getRole() || '').toUpperCase();

    if (role === expected) return true;

    // Redirect by actual role
    switch (role) {
      case 'ADMIN':  this.router.navigate(['/admin']); break;
      case 'DOCTOR': this.router.navigate(['/doctor']); break;
      case 'PATIENT': this.router.navigate(['/patient']); break;
      default:        this.router.navigate(['/auth/login']);
    }
    return false;
  }
}
