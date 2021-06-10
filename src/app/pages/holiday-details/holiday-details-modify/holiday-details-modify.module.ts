import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HolidayDetailsModifyRoutingModule } from './holiday-details-modify-routing.module';
import { HolidayDetailsModifyComponent } from './holiday-details-modify.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MAT_DATE_LOCALE } from '@angular/material';

@NgModule({
  declarations: [HolidayDetailsModifyComponent],
  imports: [
    CommonModule,
    HolidayDetailsModifyRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ]
})
export class HolidayDetailsModifyModule { }
