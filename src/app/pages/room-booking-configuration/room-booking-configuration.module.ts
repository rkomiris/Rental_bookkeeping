import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomBookingConfigurationRoutingModule } from './room-booking-configuration-routing.module';
import { RoomBookingConfigurationComponent } from './room-booking-configuration.component';
import { MaterialModule } from '../../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [RoomBookingConfigurationComponent],
  imports: [
    CommonModule,
    RoomBookingConfigurationRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  schemas: [ 
    CUSTOM_ELEMENTS_SCHEMA 
  ]
})
export class RoomBookingConfigurationModule { }
