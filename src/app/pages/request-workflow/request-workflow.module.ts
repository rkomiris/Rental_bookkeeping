import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestWorkflowRoutingModule } from './request-workflow-routing.module';
import { RequestWorkflowComponent } from './request-workflow.component';
import { MaterialModule } from '../../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [RequestWorkflowComponent],
  imports: [
    CommonModule,
    RequestWorkflowRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class RequestWorkflowModule { }
