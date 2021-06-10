
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WidgetsModifyRoutingModule } from './widgets-modify-routing.module';
import { WidgetsModifyComponent } from './widgets-modify.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppDateAdapter,APP_DATE_FORMATS } from 'src/app/shared/data.format';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';


@NgModule({
  declarations: [WidgetsModifyComponent],
  imports: [
    CommonModule,
    WidgetsModifyRoutingModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ]
})
export class WidgetsModifyModule { }
