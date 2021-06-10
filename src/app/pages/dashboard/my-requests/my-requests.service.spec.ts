import { TestBed } from '@angular/core/testing';

import { MyRequestsService } from './my-requests.service';

describe('MyRequestsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyRequestsService = TestBed.get(MyRequestsService);
    expect(service).toBeTruthy();
  });
});
