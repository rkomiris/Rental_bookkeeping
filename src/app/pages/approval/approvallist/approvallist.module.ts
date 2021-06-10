import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApprovallistComponent } from './approvallist.component';
import { ApprovallistRoutingModule } from './approvallist-routing.module';
import { MaterialModule } from '../../../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { LeftNavModule } from 'src/app/shared/left-nav/left-nav.module';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/data.format';
import { LeftNavComponent } from 'src/app/shared/left-nav/left-nav.component';
@NgModule({
  declarations: [ApprovallistComponent],
  imports: [
    CommonModule,
    ApprovallistRoutingModule,
    LeftNavModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ]
})
export class ApprovallistModule { }

