import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetsAdminAddComponent } f./widgets-admin-add.componentd.component';

describe('WidgetsAddComponent', () => {
  let component: WidgetsAdminAddComponent;
  let fixture: ComponentFixture<WidgetsAdminAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetsAdminAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetsAdminAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
