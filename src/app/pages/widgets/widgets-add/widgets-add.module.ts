
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { WidgetsAddComponent } from './widgets-add.component';
import { WidgetsAddRoutingModule } from './widgets-add.routing';
import { WidgetsAddService } from './widgets-add.service';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/data.format';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';

@NgModule({
  declarations: [WidgetsAddComponent],
  imports: [
    CommonModule,
    WidgetsAddRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ]
})
export class WidgetsAddModule { }
