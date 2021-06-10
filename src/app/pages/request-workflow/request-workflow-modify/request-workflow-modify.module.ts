import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestWorkflowModifyRoutingModule } from './request-workflow-modify-routing.module';
import { RequestWorkflowModifyComponent } from './request-workflow-modify.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [RequestWorkflowModifyComponent],
  imports: [
    CommonModule,
    RequestWorkflowModifyRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class RequestWorkflowModifyModule { }
