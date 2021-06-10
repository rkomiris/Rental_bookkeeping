import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentAddRoutingModule } from './department-add-routing.module';
import { DepartmentAddComponent } from './department-add.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [DepartmentAddComponent],
  imports: [
    CommonModule,
    DepartmentAddRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class DepartmentAddModule { }
