
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SublocationAddRoutingModule } from './sublocation-add-routing.module';
import { SublocationAddComponent } from './sublocation-add.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [SublocationAddComponent],
  imports: [
    CommonModule,
    SublocationAddRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class SublocationAddModule { }
