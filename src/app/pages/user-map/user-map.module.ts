
// import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { PhoneBookDetailsRoutingModule } from './user-map-routing.module';
import { UserMapRoutingModule } from './user-map-routing.module';
import { UserMapAddComponent } from './user-map-add/user-map-add.component';
import { UserMapViewComponent } from './user-map-view/user-map-view.component';
import { UserMapModifyComponent } from './user-map-modify/user-map-modify.component';
import { UserMapComponent } from './user-map.component';
import { MAT_DATE_LOCALE } from '@angular/material';
@NgModule({
  declarations: [UserMapComponent],
  imports: [
    CommonModule,
    UserMapRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ]
})
export class UserMapModule { }
