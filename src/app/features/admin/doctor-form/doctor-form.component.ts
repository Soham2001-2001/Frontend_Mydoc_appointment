import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService, Specialization } from '../services/admin.service';

@Component({
  selector: 'app-doctor-form',
  templateUrl: './doctor-form.component.html',
  styleUrls: ['./doctor-form.component.scss']
})
export class DoctorFormComponent implements OnInit {
  specs: Specialization[] = [];
  saving = false;
  errorMsg = '';

  form = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]], // ✅ exactly 10 digits
    password: ['', [Validators.required, Validators.minLength(6)]],        // ✅ min 6 chars
    specializationId: [undefined as number | undefined, [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private admin: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.admin.getSpecializations().subscribe({
      next: rows => (this.specs = rows),
      error: e => console.error(e)
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMsg = 'Please fix the highlighted fields.';
      return;
    }
    this.saving = true;
    this.errorMsg = '';

    const payload = this.form.value as any;

    this.admin.addDoctor(payload).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/admin/doctors']); // stay in Admin shell
      },
      error: e => {
        this.saving = false;
        const backend = e?.error?.errors ? JSON.stringify(e.error.errors) : '';
        this.errorMsg = e?.status === 400
          ? (`Invalid data. ${backend}` || 'Invalid data.')
          : 'Create failed.';
      }
    });
  }
}
