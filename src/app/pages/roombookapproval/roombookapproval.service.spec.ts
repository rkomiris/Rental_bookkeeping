import { TestBed } from '@angular/core/testing';

import { RoombookapprovalService } from './roombookapproval.service';

describe('RoombookapprovalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RoombookapprovalService = TestBed.get(RoombookapprovalService);
    expect(service).toBeTruthy();
  });
});
