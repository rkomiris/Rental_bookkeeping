import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestWorkflowViewRoutingModule } from './request-workflow-view-routing.module';
import { RequestWorkflowViewComponent } from './request-workflow-view.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [RequestWorkflowViewComponent],
  imports: [
    CommonModule,
    RequestWorkflowViewRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class RequestWorkflowViewModule { }
