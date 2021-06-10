import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomconfigModifyRoutingModule } from './roomconfig-modify-routing.module';
import { RoomconfigModifyComponent } from './roomconfig-modify.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
@NgModule({
  declarations: [RoomconfigModifyComponent],
  imports: [
    CommonModule,
    RoomconfigModifyRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ]
})
export class RoomconfigModifyModule { }
