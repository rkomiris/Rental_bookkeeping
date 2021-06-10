import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomBookingConfigurationRoutingModule } from './room-booking-configuration-routing.module';
import { RoomBookingConfigurationViewComponent } from './room-booking-configuration-view.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [RoomBookingConfigurationViewComponent],
  imports: [
    CommonModule,
    RoomBookingConfigurationRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class RoomBookingConfigurationViewModule { }
