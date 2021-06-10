import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HolidayDetailsViewRoutingModule } from './holiday-details-view-routing.module';
import { HolidayDetailsViewComponent } from './holiday-details-view.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MAT_DATE_LOCALE } from '@angular/material';


@NgModule({
  declarations: [HolidayDetailsViewComponent],
  imports: [
    CommonModule,
    HolidayDetailsViewRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ]
})
export class HolidayDetailsViewModule { }
