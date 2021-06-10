
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SublocationModifyRoutingModule } from './sublocation-modify-routing.module';
import { SublocationModifyComponent } from './sublocation-modify.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [SublocationModifyComponent],
  imports: [
    CommonModule,
    SublocationModifyRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class SublocationModifyModule { }
