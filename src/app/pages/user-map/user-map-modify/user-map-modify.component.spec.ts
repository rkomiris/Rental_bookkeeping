import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMapModifyComponent } from './user-map-modify.component';

describe('UserMapModifyComponent', () => {
  let component: UserMapModifyComponent;
  let fixture: ComponentFixture<UserMapModifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserMapModifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMapModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
