import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneBookDetailsAddComponent } from './phone-book-details-add.component';

describe('PhoneBookDetailsAddComponent', () => {
  let component: PhoneBookDetailsAddComponent;
  let fixture: ComponentFixture<PhoneBookDetailsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhoneBookDetailsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneBookDetailsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
