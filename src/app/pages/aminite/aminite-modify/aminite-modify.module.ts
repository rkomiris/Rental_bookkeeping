import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AminiteModifyRoutingModule } from './aminite-modify-routing.module';
import { AminiteModifyComponent } from './aminite-modify.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AminiteModifyComponent],
  imports: [
    CommonModule,
    AminiteModifyRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class AminiteModifyModule { }

