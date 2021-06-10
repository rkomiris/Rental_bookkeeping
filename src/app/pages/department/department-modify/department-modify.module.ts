import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentModifyRoutingModule } from './department-modify-routing.module';
import { DepartmentModifyComponent } from './department-modify.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [DepartmentModifyComponent],
  imports: [
    CommonModule,
    DepartmentModifyRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class DepartmentModifyModule { }

