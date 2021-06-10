import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactDetailsViewComponent } from './contact-details-view.component';

describe('ContactDetailsViewComponent', () => {
  let component: ContactDetailsViewComponent;
  let fixture: ComponentFixture<ContactDetailsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactDetailsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactDetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
