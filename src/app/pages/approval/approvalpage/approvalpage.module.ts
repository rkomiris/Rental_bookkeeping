import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApprovalpageComponent } from './approvalpage.component';
import { ApprovalpageRoutingModule } from './approvalpage-routing.module';
import { MaterialModule } from '../../../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { AppDateAdapter,APP_DATE_FORMATS } from 'src/app/shared/data.format';
@NgModule({
  declarations: [ApprovalpageComponent],
  imports: [
    CommonModule,
    ApprovalpageRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ]
})
export class ApprovalpageModule { }

