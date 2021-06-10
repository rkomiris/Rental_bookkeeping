import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HolidayDetailsRoutingModule } from './holiday-details-routing.module';
import { HolidayDetailsComponent } from './holiday-details.component';
import { MaterialModule } from '../../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MAT_DATE_LOCALE } from '@angular/material';
@NgModule({
  declarations: [HolidayDetailsComponent],
  imports: [
    CommonModule,
    HolidayDetailsRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  exports: [
    HolidayDetailsComponent
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ]
})
export class HolidayDetailsModule { }
