import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLocationBarComponent } from './admin-location-bar.component';

describe('AdminLocationBarComponent', () => {
  let component: AdminLocationBarComponent;
  let fixture: ComponentFixture<AdminLocationBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminLocationBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLocationBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
