import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoombookapprovalComponent } from './roombookapproval.component';

describe('RoombookapprovalComponent', () => {
  let component: RoombookapprovalComponent;
  let fixture: ComponentFixture<RoombookapprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoombookapprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoombookapprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
