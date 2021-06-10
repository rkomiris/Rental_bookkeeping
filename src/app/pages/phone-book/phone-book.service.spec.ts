import { TestBed } from '@angular/core/testing';

import { PhoneBookService } from './phone-book.service';

describe('PhoneBookService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PhoneBookService = TestBed.get(PhoneBookService);
    expect(service).toBeTruthy();
  });
});
