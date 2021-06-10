import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanMasterRoutingModule } from './plan-master-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlanMasterComponent } from './plan-master.component';
import { PlanMasterService } from './plan-master.service';
import { MAT_DATE_LOCALE } from '@angular/material';

@NgModule({
  declarations: [PlanMasterComponent],
  imports: [
    CommonModule,
    PlanMasterRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers:[ 
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    PlanMasterService
  ]
})
export class PlanMasterModule { }
