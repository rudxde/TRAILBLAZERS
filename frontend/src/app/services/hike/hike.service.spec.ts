import { TestBed } from '@angular/core/testing';

import { HikeService } from './hike.service';

describe('HikeRecommendationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HikeService = TestBed.get(HikeService);
    expect(service).toBeTruthy();
  });
});
