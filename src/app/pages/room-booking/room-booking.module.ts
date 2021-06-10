
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomBookingRoutingModule } from './room-booking-routing.module';
import { RoomBookingComponent } from './room-booking.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { FullCalendarModule } from 'ng-fullcalendar';
import { RoombookDetailComponent } from './roombook-detail/roombook-detail.component';
import { MatDialogModule } from '@angular/material';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

@NgModule({
  declarations: [
    RoomBookingComponent,
    RoombookDetailComponent
  ],

  imports: [
    CommonModule,
    RoomBookingRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxMaterialTimepickerModule,
    FullCalendarModule,
    MatDialogModule, OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],

  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],

  entryComponents:[RoombookDetailComponent]

})
export class RoomBookingModule { }
