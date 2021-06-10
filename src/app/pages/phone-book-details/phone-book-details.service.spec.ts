import { TestBed } from '@angular/core/testing';

import { PhoneBookDetailsService } from './phone-book-details.service';

describe('PhoneBookDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PhoneBookDetailsService = TestBed.get(PhoneBookDetailsService);
    expect(service).toBeTruthy();
  });
});
