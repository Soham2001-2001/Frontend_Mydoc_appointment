import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecializationsListComponent } from './specializations-list.component';

describe('SpecializationsListComponent', () => {
  let component: SpecializationsListComponent;
  let fixture: ComponentFixture<SpecializationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecializationsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecializationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
