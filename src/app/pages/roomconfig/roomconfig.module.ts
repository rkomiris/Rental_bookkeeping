import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomconfigRoutingModule } from './roomconfig-routing.module';
import { RoomconfigComponent } from './roomconfig.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [RoomconfigComponent],
  imports: [
    CommonModule,
    RoomconfigRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class RoomconfigModule { }
