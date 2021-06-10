import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomconfigAddRoutingModule } from './roomconfig-add-routing.module';
import { RoomconfigAddComponent } from './roomconfig-add.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
@NgModule({
  declarations: [RoomconfigAddComponent],
  imports: [
    CommonModule,
    RoomconfigAddRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ]
})
export class RoomconfigAddModule { }
