
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SublocationViewRoutingModule } from './sublocation-view-routing.module';
import { SublocationViewComponent } from './sublocation-view.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [SublocationViewComponent],
  imports: [
    CommonModule,
    SublocationViewRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class SublocationViewModule { }
