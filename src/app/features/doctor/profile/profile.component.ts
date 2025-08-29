import { Component, OnInit } from '@angular/core';
import { DoctorService, DoctorProfile } from '../doctor.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profile: DoctorProfile = { id: 0, name: '', email: '', phone: '', specialization: '' };
  loading = true;
  error: string | null = null;
  editMode = false;

  // Example list – ideally fetch from backend
  specializations: string[] = [
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Pediatrics',
    'Orthopedics'
  ];

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.doctorService.getProfile().subscribe({
      next: (data: DoctorProfile) => {
        this.profile = data;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Failed to load profile';
        console.error(err);
        this.loading = false;
      }
    });
  }

  enableEdit(): void {
    this.editMode = true;
  }

  cancelEdit(): void {
    this.editMode = false;
    this.loadProfile();
  }

  saveProfile(): void {
    this.doctorService.updateProfile(this.profile).subscribe({
      next: (data: DoctorProfile) => {
        this.profile = data;
        this.editMode = false;
        alert('✅ Profile updated successfully!');
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Failed to update profile';
        console.error(err);
      }
    });
  }
}
