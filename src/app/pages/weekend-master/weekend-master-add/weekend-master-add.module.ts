import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeekendMasterAddRoutingModule } from './weekend-master-add-routing.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { WeekendMasterAddComponent } from './weekend-master-add.component';

@NgModule({
  declarations: [WeekendMasterAddComponent],
  imports: [
    CommonModule,
    WeekendMasterAddRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class WeekendMasterAddModule { }
