
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/data.format';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { WidgetsAdminAddComponent } from './widgets-admin-add.component';
import { WidgetsAdminAddRoutingModule } from './widgets-admin-add.routing';
import { WidgetsAdminAddService } from './widgets-admin-add.service';

@NgModule({
  declarations: [WidgetsAdminAddComponent],
  imports: [
    CommonModule,
    WidgetsAdminAddRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ]
})
export class WidgetsAdminAddModule { }
