import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomconfigViewRoutingModule } from './roomconfig-view-routing.module';
import { RoomconfigViewComponent } from './roomconfig-view.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
@NgModule({
  declarations: [RoomconfigViewComponent],
  imports: [
    CommonModule,
    RoomconfigViewRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ]
})
export class RoomconfigViewModule { }
