
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import {  WidgetsAdminComponent } from './widgets-admin.component';
import { WidgetsAdminService } from './widgets-admin.service';
import { WidgetsAdminRoutingModule } from './widgets-admin-routing.module';
import { MAT_DATE_LOCALE } from '@angular/material';

@NgModule({
    declarations: [WidgetsAdminComponent],
    imports: [
      CommonModule,
      WidgetsAdminRoutingModule,
      MaterialModule,
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
    ],
    providers: [WidgetsAdminService,     
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
      ]
  })
  export class WidgetsAdminModule { }
