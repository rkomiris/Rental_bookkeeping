
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestSubtypeViewRoutingModule } from './request-subtype-view-routing.module';
import { RequestSubtypeViewComponent } from './request-subtype-view.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [RequestSubtypeViewComponent],
  imports: [
    CommonModule,
    RequestSubtypeViewRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class RequestSubtypeViewModule { }
