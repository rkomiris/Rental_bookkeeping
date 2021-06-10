
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SublocationRoutingModule } from './sublocation-routing.module';
import { SublocationComponent } from './sublocation.component';
import { MaterialModule } from '../../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [SublocationComponent],
  imports: [
    CommonModule,
    SublocationRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class SublocationModule { }
