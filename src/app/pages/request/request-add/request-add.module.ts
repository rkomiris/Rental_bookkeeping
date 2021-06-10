import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestAddRoutingModule } from './request-add-routing.module';
import { RequestAddComponent } from './request-add.component';
import { MaterialModule } from '../../../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { MAT_DATE_LOCALE } from '@angular/material';


@NgModule({
  declarations: [RequestAddComponent],
  imports: [
    CommonModule,
    RequestAddRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ]
})
export class RequestAddModule { }
