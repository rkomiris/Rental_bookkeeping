import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoombookapprovalmodifyRoutingModule } from './roombookapprovalmodify-routing.module';
import { RoombookapprovalmodifyComponent } from './roombookapprovalmodify.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [RoombookapprovalmodifyComponent],
  imports: [
    CommonModule,
    RoombookapprovalmodifyRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class RoombookapprovalmodifyModule { }
