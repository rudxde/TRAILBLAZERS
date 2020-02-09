import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HikeRecommendationComponent } from './hike-recommendation.component';

describe('HikeRecommendationComponent', () => {
  let component: HikeRecommendationComponent;
  let fixture: ComponentFixture<HikeRecommendationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HikeRecommendationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HikeRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
