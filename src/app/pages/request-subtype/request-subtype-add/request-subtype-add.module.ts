
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestSubtypeAddRoutingModule } from './request-subtype-add-routing.module';
import { RequestSubtypeAddComponent } from './request-subtype-add.component';
import { MaterialModule } from '../../../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [RequestSubtypeAddComponent],
  imports: [
    CommonModule,
    RequestSubtypeAddRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class RequestSubtypeAddModule { }
