import { TestBed } from '@angular/core/testing';

import { PositionMockService } from './position-mock.service';

describe('PositionMockService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PositionMockService = TestBed.get(PositionMockService);
    expect(service).toBeTruthy();
  });
});
