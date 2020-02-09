import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HikingRouteDetailsComponent } from './hiking-route-details.component';

describe('HikingRouteDetailsComponent', () => {
  let component: HikingRouteDetailsComponent;
  let fixture: ComponentFixture<HikingRouteDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HikingRouteDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HikingRouteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
