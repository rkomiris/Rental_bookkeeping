import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeekendMasterModifyRoutingModule } from './weekend-master-modify-routing.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { WeekendMasterModifyComponent } from './weekend-master-modify.component';

@NgModule({
  declarations: [WeekendMasterModifyComponent],
  imports: [
    CommonModule,
    WeekendMasterModifyRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class WeekendMasterModifyModule { }
