import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { PatientService } from '../services/patient.service';
import { AuthService } from 'src/app/core/auth.service';

export interface PatientProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob?: string;
  gender?: '' | 'MALE' | 'FEMALE' | 'OTHER';
  address?: string;
}

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.scss']
})
export class PatientProfileComponent implements OnInit {
  profile: PatientProfile | null = null;

  // UI state
  loading = true;
  editing = false;
  saving = false;
  errorMsg: string | null = null;

  // change password state
  showPwdPanel = false;
  pwdSaving = false;
  pwdMsg: string | null = null;

  // restrict DOB to not-future
  today: string = new Date().toISOString().split('T')[0];

  // Profile form
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    dob: [''],
    gender: ['' as '' | 'MALE' | 'FEMALE' | 'OTHER'],
    address: ['']
  });

  // Change password form
  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmNewPassword: ['', Validators.required]
  }, { validators: [passwordsMatch('newPassword', 'confirmNewPassword')] });

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const patientId = this.auth.getReferenceId();
    if (!patientId) {
      this.loading = false;
      this.errorMsg = 'No patient ID in session.';
      return;
    }

    this.patientService.getProfile(patientId).subscribe({
      next: (res) => {
        this.profile = res;
        this.form.patchValue(res);
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to load profile.';
        this.loading = false;
      }
    });
  }

  // -------- Profile edit flow --------
  startEdit() {
    this.editing = true;
    if (this.profile) this.form.patchValue(this.profile);
  }

  cancelEdit() {
    this.editing = false;
    this.errorMsg = null;
    if (this.profile) this.form.patchValue(this.profile);
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.errorMsg = null;

    const v = this.form.value;
    const body: Partial<PatientProfile> = {
      name: v.name ?? undefined,
      email: v.email ?? undefined,
      phone: v.phone ?? undefined,
      dob: v.dob || undefined,
      gender: (v.gender as '' | 'MALE' | 'FEMALE' | 'OTHER' | undefined) || undefined,
      address: v.address ?? undefined,
    };

    const patientId = this.auth.getReferenceId()!;
    this.patientService.updateProfile(patientId, body).subscribe({
      next: (res) => {
        this.profile = res;
        this.editing = false;
        this.saving = false;
      },
      error: () => {
        this.errorMsg = 'Update failed.';
        this.saving = false;
      }
    });
  }

  // -------- Change password flow --------
  togglePwdPanel() {
    this.showPwdPanel = !this.showPwdPanel;
    this.pwdMsg = null;
    if (!this.showPwdPanel) {
      this.passwordForm.reset();
    }
  }

  changePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.pwdSaving = true;
    this.pwdMsg = null;

    const { currentPassword, newPassword, confirmNewPassword } = this.passwordForm.value;
    const patientId = this.auth.getReferenceId()!;

    this.patientService.changePassword(patientId, {
      currentPassword: currentPassword || '',
      newPassword: newPassword || '',
      confirmNewPassword: confirmNewPassword || ''
    }).subscribe({
      next: () => {
        this.pwdSaving = false;
        this.pwdMsg = '✅ Password updated successfully.';
        this.passwordForm.reset();
      },
      error: (e) => {
        this.pwdSaving = false;
        this.pwdMsg = e?.error?.message || '❌ Failed to change password. Check current password.';
      }
    });
  }
}

/** Cross-field validator to ensure two controls match */
function passwordsMatch(pwdKey: string, confirmKey: string) {
  return (group: AbstractControl): ValidationErrors | null => {
    const pwd = group.get(pwdKey)?.value;
    const confirm = group.get(confirmKey)?.value;
    if (!pwd || !confirm) return null;
    return pwd === confirm ? null : { passwordsMismatch: true };
  };
}
