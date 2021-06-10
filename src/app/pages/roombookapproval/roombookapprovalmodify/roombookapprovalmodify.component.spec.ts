import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoombookapprovalmodifyComponent } from './roombookapprovalmodify.component';

describe('RoombookapprovalmodifyComponent', () => {
  let component: RoombookapprovalmodifyComponent;
  let fixture: ComponentFixture<RoombookapprovalmodifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoombookapprovalmodifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoombookapprovalmodifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
