import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreappComponent } from './moreapp.component';

describe('MoreappComponent', () => {
  let component: MoreappComponent;
  let fixture: ComponentFixture<MoreappComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoreappComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
