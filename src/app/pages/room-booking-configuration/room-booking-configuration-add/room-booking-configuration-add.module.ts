import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomBookingConfigurationAddRoutingModule } from './room-booking-configuration-add-routing.module';
import { RoomBookingConfigurationAddComponent } from './room-booking-configuration-add.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [RoomBookingConfigurationAddComponent],
  imports: [
    CommonModule,
    RoomBookingConfigurationAddRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class RoomBookingConfigurationAddModule { }
