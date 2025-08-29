import { Component, OnInit } from '@angular/core';
import { AdminService, Specialization } from '../services/admin.service';

@Component({
  selector: 'app-specializations-list',
  templateUrl: './specializations-list.component.html',
  styleUrls: ['./specializations-list.component.scss']
})
export class SpecializationsListComponent implements OnInit {
  list: Specialization[] = [];
  name = '';
  loading = false;
  errorMsg = '';

  constructor(private admin: AdminService) {}

  ngOnInit(): void { this.fetch(); }

  fetch(): void {
    this.loading = true;
    this.admin.getSpecializations().subscribe({
      next: rows => { this.list = rows; this.loading = false; },
      error: e => { this.loading = false; this.errorMsg = 'Failed to load'; console.error(e); }
    });
  }

  add(): void {
    if (!this.name.trim()) return;
    this.admin.addSpecialization({ name: this.name.trim() }).subscribe({
      next: () => { this.name = ''; this.fetch(); },
      error: e => console.error(e)
    });
  }

  remove(id: number): void {
    this.admin.deleteSpecialization(id).subscribe({
      next: () => this.fetch(),
      error: e => console.error(e)
    });
  }
}
