
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestSubtypeModifyRoutingModule } from './request-subtype-modify-routing.module';
import { RequestSubtypeModifyComponent } from './request-subtype-modify.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [RequestSubtypeModifyComponent],
  imports: [
    CommonModule,
    RequestSubtypeModifyRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class RequestSubtypeModifyModule { }
