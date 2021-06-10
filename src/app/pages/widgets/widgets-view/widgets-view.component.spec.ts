import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetsViewComponent } from './widgets-view.component';

describe('WidgetsViewComponent', () => {
  let component: WidgetsViewComponent;
  let fixture: ComponentFixture<WidgetsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
