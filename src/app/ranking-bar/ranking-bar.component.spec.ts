import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingBarComponent } from './ranking-bar.component';

describe('RankingBarComponent', () => {
  let component: RankingBarComponent;
  let fixture: ComponentFixture<RankingBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RankingBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RankingBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
