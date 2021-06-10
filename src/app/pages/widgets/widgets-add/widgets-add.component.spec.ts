import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetsAddComponent } from './widgets-add.component';

describe('WidgetsAddComponent', () => {
  let component: WidgetsAddComponent;
  let fixture: ComponentFixture<WidgetsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
