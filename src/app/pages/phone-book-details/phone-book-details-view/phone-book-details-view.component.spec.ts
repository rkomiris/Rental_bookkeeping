import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneBookDetailsViewComponent } from './phone-book-details-view.component';

describe('PhoneBookDetailsViewComponent', () => {
  let component: PhoneBookDetailsViewComponent;
  let fixture: ComponentFixture<PhoneBookDetailsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhoneBookDetailsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneBookDetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
