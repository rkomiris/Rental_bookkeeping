import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomBookingConfigurationModfiyRoutingModule } from './room-booking-configuration-modfiy-routing.module';
import { RoomBookingConfigurationModfiyComponent } from './room-booking-configuration-modfiy.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [RoomBookingConfigurationModfiyComponent],
  imports: [
    CommonModule,
    RoomBookingConfigurationModfiyRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class RoomBookingConfigurationModfiyModule { }
