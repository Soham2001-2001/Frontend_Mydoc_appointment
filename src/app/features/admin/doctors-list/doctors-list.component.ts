import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService, Doctor, Specialization } from '../services/admin.service';

type EditForm = {
  name?: string;
  email?: string;
  phone?: string;
  specializationId?: number;
  password: string; // required on update
};

@Component({
  selector: 'app-doctors-list',
  templateUrl: './doctors-list.component.html',
  styleUrls: ['./doctors-list.component.scss']
})
export class DoctorsListComponent implements OnInit {
  doctors: Doctor[] = [];
  specializations: Specialization[] = [];

  editingId: number | null = null;
  editingRow: Doctor | null = null;
  form: EditForm = { password: '' };

  loading = false;
  saving = false;
  deletingId: number | null = null;
  errorMsg = '';
  successMsg = '';

  constructor(private admin: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.fetch();
    this.loadSpecs();
  }

  fetch(): void {
    this.loading = true;
    this.admin.getDoctors().subscribe({
      next: rows => { this.doctors = rows; this.loading = false; },
      error: e => { this.loading = false; this.errorMsg = 'Failed to load doctors'; console.error(e); }
    });
  }

  loadSpecs(): void {
    this.admin.getSpecializations().subscribe({
      next: rows => this.specializations = rows,
      error: e => console.error(e)
    });
  }

  goToAdd(): void {
    this.router.navigate(['admin', 'doctors', 'new']);
  }

  startEdit(d: Doctor): void {
    this.editingId = d.id;
    this.editingRow = d;
    this.successMsg = ''; this.errorMsg = '';
    this.form = {
      name: d.name,
      email: d.email,
      phone: d.phone,
      specializationId: d.specialization?.id,
      password: '' // user must enter new password to satisfy backend
    };
  }

  cancel(): void {
    this.editingId = null;
    this.editingRow = null;
    this.form = { password: '' };
  }

  private buildFullPayload(): any {
    const d = this.editingRow!;
    const name  = this.form.name  ?? d.name;
    const email = this.form.email ?? d.email;
    const phone = this.form.phone ?? d.phone;
    const specId = this.form.specializationId ?? d.specialization?.id;
    const password = (this.form.password || '').trim();

    if (!name || !email || !phone || !specId || password.length < 6) {
      throw new Error('Fill Name, Email, Phone, Specialization and a password (min 6 chars).');
    }

    return { name, email, phone, specializationId: specId, password };
  }

  save(): void {
    if (!this.editingId || !this.editingRow) return;

    let payload: any;
    try { payload = this.buildFullPayload(); }
    catch (e: any) { this.errorMsg = e?.message || 'Missing required fields.'; return; }

    this.saving = true;
    this.admin.updateDoctor(this.editingId, payload).subscribe({
      next: () => {
        this.saving = false;
        this.successMsg = 'Updated successfully';
        this.editingId = null;
        this.editingRow = null;
        this.fetch();
      },
      error: e => {
        this.saving = false;
        const backend = e?.error?.errors ? JSON.stringify(e.error.errors) : '';
        this.errorMsg =
          e?.status === 400 ? (`Invalid data. ${backend}` || 'Invalid data.') :
          e?.status === 403 ? 'Not authorized.' :
          e?.status === 404 ? 'Doctor not found.' : 'Update failed.';
      }
    });
  }

  // --- Delete ---
  confirmDelete(d: Doctor): void {
    if (this.editingId === d.id) return; // avoid conflict while editing
    const yes = window.confirm(`Delete doctor "${d.name}"?`);
    if (!yes) return;

    this.deletingId = d.id;
    this.admin.deleteDoctor(d.id).subscribe({
      next: () => {
        this.deletingId = null;
        this.successMsg = 'Deleted successfully';
        this.fetch();
      },
      error: e => {
        console.error(e);
        this.deletingId = null;
        this.errorMsg =
          e?.status === 403 ? 'Not authorized.' :
          e?.status === 404 ? 'Doctor not found.' : 'Delete failed.';
      }
    });
  }
}
