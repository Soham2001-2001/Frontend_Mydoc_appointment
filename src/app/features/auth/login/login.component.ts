import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';

  loading = false;
  errorMsg: string | null = null;

  private preferredRole: string | null = null;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.preferredRole = this.route.snapshot.queryParamMap.get('role');
  }

  private isValidEmail(v: string): boolean {
    // simple & robust email validator
    const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    return re.test(v);
  }

  onSubmit(): void {
    const email = this.email.trim();
    const password = this.password; // keep spaces if user intended

    // client-side guard rails
    if (!email || !password) {
      this.errorMsg = 'Please enter email and password.';
      return;
    }
    if (!this.isValidEmail(email)) {
      this.errorMsg = 'Invalid email format.';
      return;
    }
    if (password.length < 6) {
      this.errorMsg = 'Password must be at least 6 characters.';
      return;
    }

    this.errorMsg = null;
    this.loading = true;

    this.auth.login(email, password).subscribe({
      next: () => {
        const role = (this.auth.getRole() || this.preferredRole || 'PATIENT').toUpperCase();
        if (role === 'ADMIN') this.router.navigate(['/admin']);
        else if (role === 'DOCTOR') this.router.navigate(['/doctor']);
        else this.router.navigate(['/patient']);
      },
      error: (err) => {
        console.error('Login failed', err);
        this.errorMsg = 'Invalid credentials. Please try again.';
        this.loading = false;
      },
      complete: () => (this.loading = false)
    });
  }
}
