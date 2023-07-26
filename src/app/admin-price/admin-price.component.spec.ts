import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPriceComponent } from './admin-price.component';

describe('AdminPriceComponent', () => {
  let component: AdminPriceComponent;
  let fixture: ComponentFixture<AdminPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminPriceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
