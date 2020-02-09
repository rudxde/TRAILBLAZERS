import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HikingRouteComponent } from './hiking-route.component';

describe('HikingRouteComponent', () => {
  let component: HikingRouteComponent;
  let fixture: ComponentFixture<HikingRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HikingRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HikingRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
