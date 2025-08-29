import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-login',
  templateUrl: './role-login.component.html',
  styleUrls: ['./role-login.component.scss']
})
export class RoleLoginComponent {
  constructor(private router: Router) {}

  goToLogin(role: string) {
    this.router.navigate(['/auth/login'], { queryParams: { role } });
  }
}
