import { TestBed } from '@angular/core/testing';

import { UserMapService } from './user-map.service';

describe('UserMapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserMapService = TestBed.get(UserMapService);
    expect(service).toBeTruthy();
  });
});
