import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DelegationModifyRoutingModule } from './delegation-modify-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeftNavModule } from 'src/app/shared/left-nav/left-nav.module';
import { DelegationModifyComponent } from './delegation-modify.component';

@NgModule({
  declarations: [DelegationModifyComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    LeftNavModule,
    DelegationModifyRoutingModule
  ]
})
export class DelegationModifyModule { }
