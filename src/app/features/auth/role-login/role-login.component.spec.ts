import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleLoginComponent } from './role-login.component';

describe('RoleLoginComponent', () => {
  let component: RoleLoginComponent;
  let fixture: ComponentFixture<RoleLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
