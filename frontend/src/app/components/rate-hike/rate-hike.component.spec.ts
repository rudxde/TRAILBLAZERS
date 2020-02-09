import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateHikeComponent } from './rate-hike.component';

describe('RateHikeComponent', () => {
  let component: RateHikeComponent;
  let fixture: ComponentFixture<RateHikeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateHikeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateHikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
