import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplinksComponent } from './applinks.component';

describe('ApplinksComponent', () => {
  let component: ApplinksComponent;
  let fixture: ComponentFixture<ApplinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
