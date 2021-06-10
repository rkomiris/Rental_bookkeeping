
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestScrconfigRoutingModule } from './request-scrconfig-routing.module';
import { RequestScrconfigComponent } from './request-scrconfig.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [RequestScrconfigComponent],
  imports: [
    CommonModule,
    RequestScrconfigRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class RequestScrconfigModule { }
