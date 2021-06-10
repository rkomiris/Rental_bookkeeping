import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompletedRequestApprovalsRoutingModule } from './completed-request-approvals-routing.module';
import { CompletedRequestApprovalsComponent } from './completed-request-approvals.component';
import { MaterialModule } from '../../../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [ 
    CompletedRequestApprovalsComponent
  ],
  imports: [
    CommonModule,
    CompletedRequestApprovalsRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class CompletedRequestApprovalsModule { }
