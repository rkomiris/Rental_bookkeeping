import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetsAdminViewComponent } from './widgets-admin-view.component';


describe('WidgetsAdminViewComponent', () => {
  let component: WidgetsAdminViewComponent;
  let fixture: ComponentFixture<WidgetsAdminViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetsAdminViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetsAdminViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
