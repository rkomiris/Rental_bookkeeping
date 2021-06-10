import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestSummaryComponent } from './request-summary.component';
import { RequestSummaryRoutingModule } from './request-summary-routing.module';
import { MaterialModule } from '../../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
@NgModule({
  declarations: [
    RequestSummaryComponent
  ],
  imports: [
    CommonModule,
    RequestSummaryRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class RequestSummaryModule { }
