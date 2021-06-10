import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactDetailsAddComponent } from './contact-details-add.component';

describe('ContactDetailsAddComponent', () => {
  let component: ContactDetailsAddComponent;
  let fixture: ComponentFixture<ContactDetailsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactDetailsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactDetailsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
