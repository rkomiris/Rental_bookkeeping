import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HolidayDetailsAddRoutingModule } from './holiday-details-add-routing.module';
import { HolidayDetailsAddComponent } from './holiday-details-add.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MAT_DATE_LOCALE } from '@angular/material';

@NgModule({
  declarations: [HolidayDetailsAddComponent],
  imports: [
    CommonModule,
    HolidayDetailsAddRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ]
})
export class HolidayDetailsAddModule { }
