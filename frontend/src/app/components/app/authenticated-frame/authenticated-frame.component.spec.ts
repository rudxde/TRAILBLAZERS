import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticatedFrameComponent } from './authenticated-frame.component';

describe('AuthenticatedFrameComponent', () => {
  let component: AuthenticatedFrameComponent;
  let fixture: ComponentFixture<AuthenticatedFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthenticatedFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticatedFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
