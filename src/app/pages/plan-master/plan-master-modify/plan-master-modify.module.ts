import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { PlanMasterModifyRoutingModule } from './plan-master-modify-routing.module';
import { PlanMasterModifyComponent } from './plan-master-modify.component';

@NgModule({
  declarations: [PlanMasterModifyComponent],
  imports: [
    CommonModule,
    PlanMasterModifyRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class PlanMasterModifyModule { }
