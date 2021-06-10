import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AminiteViewRoutingModule } from './aminite-view-routing.module';
import { AminiteViewComponent } from './aminite-view.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AminiteViewComponent],
  imports: [
    CommonModule,
    AminiteViewRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class AminiteViewModule { }

