import { TestBed } from '@angular/core/testing';

import { ApplinksService } from './applinks.service';

describe('ApplinksService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApplinksService = TestBed.get(ApplinksService);
    expect(service).toBeTruthy();
  });
});
