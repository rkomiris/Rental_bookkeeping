import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AminiteAddRoutingModule } from './aminite-add-routing.module';
import { AminiteAddComponent } from './aminite-add.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [AminiteAddComponent],
  imports: [
    CommonModule,
    AminiteAddRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class AminiteAddModule { }

