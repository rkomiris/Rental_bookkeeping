import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { PlanMasterAddComponent } from './plan-master-add.component';
import { PlanMasterAddRoutingModule } from './plan-master-add-routing.module';

@NgModule({
  declarations: [PlanMasterAddComponent],
  imports: [
    CommonModule,
    PlanMasterAddRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
   
  ]
})
export class PlanMasterAddModule { }
