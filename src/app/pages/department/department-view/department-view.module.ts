import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentViewRoutingModule } from './department-view-routing.module';
import { DepartmentViewComponent } from './department-view.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [DepartmentViewComponent],
  imports: [
    CommonModule,
    DepartmentViewRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class DepartmentViewModule { }

