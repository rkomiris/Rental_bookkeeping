import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DelegationViewRoutingModule } from './delegation-view-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LeftNavModule } from 'src/app/shared/left-nav/left-nav.module';
import { DelegationViewComponent } from './delegation-view.component';

@NgModule({
  declarations: [DelegationViewComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    LeftNavModule,
    DelegationViewRoutingModule
  ]
})
export class DelegationViewModule { }
