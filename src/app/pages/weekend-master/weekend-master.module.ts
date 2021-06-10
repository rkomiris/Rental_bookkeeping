import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeekendMasterRoutingModule } from './weekend-master-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WeekendMasterService } from './weekend-master.service';
import { WeekendMasterComponent } from './weekend-master.component';

@NgModule({
  declarations: [WeekendMasterComponent],
  imports: [
    CommonModule,
    WeekendMasterRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers:[
    WeekendMasterService
  ]
})
export class WeekendMasterModule { }
