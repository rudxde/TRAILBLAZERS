import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NextRouteComponent } from './next-route.component';

describe('NextRouteComponent', () => {
  let component: NextRouteComponent;
  let fixture: ComponentFixture<NextRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NextRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NextRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
