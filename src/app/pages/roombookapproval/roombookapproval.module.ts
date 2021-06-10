import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoombookapprovalRoutingModule } from './roombookapproval-routing.module';
import { RoombookapprovalmodifyComponent } from './roombookapprovalmodify/roombookapprovalmodify.component';
import { RoombookapprovalComponent } from './roombookapproval.component';
@NgModule({
  declarations: [RoombookapprovalComponent],
  imports: [
    CommonModule,
    RoombookapprovalRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class RoombookapprovalModule { }
