import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DelegationAddRoutingModule } from './delegation-add-routing.module';
import { LeftNavModule } from 'src/app/shared/left-nav/left-nav.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material.module';
import { DelegationAddComponent } from './delegation-add.component';

@NgModule({
  declarations: [DelegationAddComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    LeftNavModule,
    DelegationAddRoutingModule
  ]
})
export class DelegationAddModule { }
