import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneBookDetailsComponent } from './phone-book-details.component';

describe('PhoneBookDetailsComponent', () => {
  let component: PhoneBookDetailsComponent;
  let fixture: ComponentFixture<PhoneBookDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhoneBookDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneBookDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
