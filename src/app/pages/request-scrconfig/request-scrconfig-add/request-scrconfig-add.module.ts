
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestScrconfigAddRoutingModule } from './request-scrconfig-add-routing.module';
import { RequestScrconfigAddComponent } from './request-scrconfig-add.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [RequestScrconfigAddComponent],
  imports: [
    CommonModule,
    RequestScrconfigAddRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class RequestScrconfigAddModule { }
