import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestRoutingModule } from './request-routing.module';
import { RequestComponent } from './request.component';
import { MaterialModule } from '../../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { LeftNavModule } from 'src/app/shared/left-nav/left-nav.module';
import { RequestAddModule } from './request-add/request-add.module';
import { MAT_DATE_LOCALE } from '@angular/material';


@NgModule({
  declarations: [RequestComponent],
  imports: [
    CommonModule,
    RequestRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RequestAddModule,
    LeftNavModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ]
})
export class RequestModule { }
