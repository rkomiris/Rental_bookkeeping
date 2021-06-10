
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestSubtypeRoutingModule } from './request-subtype-routing.module';
import { RequestSubtypeComponent } from './request-subtype.component';
import { MaterialModule } from '../../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [RequestSubtypeComponent],
  imports: [
    CommonModule,
    RequestSubtypeRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class RequestSubtypeModule { }
