import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  public isOpen = false;

  constructor(public auth: AuthService, private router: Router) {}

  public toggleNav(): void {
    this.isOpen = !this.isOpen;
  }

  public logout(): void {
    this.auth.logout();
    this.isOpen = false;
    this.router.navigate(['/auth/login']);
  }
}
