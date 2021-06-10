import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestWorkflowAddRoutingModule } from './request-workflow-add-routing.module';
import { RequestWorkflowAddComponent } from './request-workflow-add.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [RequestWorkflowAddComponent],
  imports: [
    CommonModule,
    RequestWorkflowAddRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class RequestWorkflowAddModule { }
