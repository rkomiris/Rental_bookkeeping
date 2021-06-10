
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequesttypeAddComponent } from './requesttype-add.component';
import { RequesttypeAddRoutingModule } from './requesttype-add-routing.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [RequesttypeAddComponent],
  imports: [
    CommonModule,
    RequesttypeAddRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class RequesttypeAddModule { }
