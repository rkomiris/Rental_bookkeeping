
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequesttypeModifyRoutingModule } from './requesttype-modify-routing.module';
import { RequesttypeModifyComponent } from './requesttype-modify.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [RequesttypeModifyComponent],
  imports: [
    CommonModule,
    RequesttypeModifyRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class RequesttypeModifyModule { }
