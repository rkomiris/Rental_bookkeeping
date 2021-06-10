import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DelegationRoutingModule } from './delegation-routing.module';
import { DelegationComponent } from './delegation.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DelegationAddComponent } from './delegation-add/delegation-add.component';
import { DelegationService } from './delegation.service';
import { MAT_DATE_LOCALE } from '@angular/material';

@NgModule({
  declarations: [DelegationComponent],
  imports: [
    CommonModule,
    DelegationRoutingModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    // DelegationAddComponent
   
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB'},DelegationService]
 
})
export class DelegationModule { }
