import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanMasterViewRoutingModule } from './plan-master-view-routing.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { PlanMasterViewComponent } from './plan-master-view.component';

@NgModule({
  declarations: [ PlanMasterViewComponent],
  imports: [
    CommonModule,
    PlanMasterViewRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class PlanMasterViewModule { }
