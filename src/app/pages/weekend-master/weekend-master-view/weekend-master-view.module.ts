import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeekendMasterViewRoutingModule } from './weekend-master-view-routing.module';
import { WeekendMasterViewComponent } from './weekend-master-view.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [WeekendMasterViewComponent],
  imports: [
    CommonModule,
    WeekendMasterViewRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class WeekendMasterViewModule { }
