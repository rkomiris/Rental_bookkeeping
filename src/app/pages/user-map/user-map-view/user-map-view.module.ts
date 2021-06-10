
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserMapViewRoutingModule } from './user-map-view-routing.module';
import { UserMapViewComponent } from './user-map-view.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MAT_DATE_LOCALE } from '@angular/material';
@NgModule({
  declarations: [UserMapViewComponent],
  imports: [
    CommonModule,
    UserMapViewRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ]
})
export class UserMapViewModule { }
