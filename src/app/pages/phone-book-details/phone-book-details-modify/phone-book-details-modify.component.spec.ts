import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneBookDetailsModifyComponent } from './phone-book-details-modify.component';

describe('PhoneBookDetailsModifyComponent', () => {
  let component: PhoneBookDetailsModifyComponent;
  let fixture: ComponentFixture<PhoneBookDetailsModifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhoneBookDetailsModifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneBookDetailsModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
