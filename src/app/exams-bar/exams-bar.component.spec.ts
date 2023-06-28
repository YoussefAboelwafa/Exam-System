import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamsBarComponent } from './exams-bar.component';

describe('ExamsBarComponent', () => {
  let component: ExamsBarComponent;
  let fixture: ComponentFixture<ExamsBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamsBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
