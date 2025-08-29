import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';

type RegisterPayload = {
  name: string;
  email: string;
  phone: string;           // required
  password: string;
  dob?: string;            // optional
  gender?: string;
  address?: string;
};

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  // Bound to template via [(ngModel)]
  name = '';
  email = '';
  phone = '';
  password = '';
  dob: string | undefined;
  gender: string | undefined;
  address: string | undefined;

  // UI state
  loading = false;
  errorMsg: string | null = null;
  successMsg: string | null = null;

  today = new Date();

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  // ✅ helper: check if DOB is in the future
  isFutureDate(dateStr?: string): boolean {
    if (!dateStr) return false;
    const dob = new Date(dateStr);
    return dob > this.today;
  }

  onSubmit(): void {
    // basic checks
    if (!this.name || !this.email || !this.phone || !this.password) {
      this.errorMsg = 'Please fill Name, Email, Phone, and Password.';
      return;
    }

    // ✅ email validation
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMsg = 'Invalid email format.';
      return;
    }

    // ✅ phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(this.phone)) {
      this.errorMsg = 'Phone number must be exactly 10 digits.';
      return;
    }

    // ✅ dob validation
    if (this.isFutureDate(this.dob)) {
      this.errorMsg = 'Date of Birth cannot be in the future.';
      return;
    }

    this.errorMsg = null;
    this.successMsg = null;
    this.loading = true;

    const payload: RegisterPayload = {
      name: this.name.trim(),
      email: this.email.trim(),
      phone: this.phone.trim(),
      password: this.password,
      dob: this.dob?.trim() || undefined,
      gender: this.gender || undefined,
      address: this.address?.trim() || undefined
    };

    // call the API
    this.auth.registerPatient(payload).subscribe({
      next: () => {
        this.successMsg = 'Registration successful! Please login.';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/auth/login']), 600);
      },
      error: (err) => {
        console.error('Register failed', err);
        this.errorMsg = 'Registration failed. Email or phone may already be in use.';
        this.loading = false;
      }
    });
  }
}
