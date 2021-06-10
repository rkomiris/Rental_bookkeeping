import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppDateAdapter,APP_DATE_FORMATS } from 'src/app/shared/data.format';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { WidgetsAdminModifyRoutingModule } from './widgets-admin-modify-routing.module';
import { WidgetsAdminModifyComponent } from './widgets-admin-modify.component';


@NgModule({
  declarations: [WidgetsAdminModifyComponent],
  imports: [
    CommonModule,
    WidgetsAdminModifyRoutingModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ]
})
export class WidgetsAdminModifyModule { }
