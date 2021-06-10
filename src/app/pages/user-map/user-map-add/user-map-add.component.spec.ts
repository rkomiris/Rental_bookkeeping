import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMapAddComponent } from './user-map-add.component';

describe('UserMapAddComponent', () => {
  let component: UserMapAddComponent;
  let fixture: ComponentFixture<UserMapAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserMapAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMapAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
