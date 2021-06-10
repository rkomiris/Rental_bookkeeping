import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationModifyComponent } from './location-modify.component';
import { LocationModifyRoutingModule } from './location-modify-routing.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [LocationModifyComponent],
  imports: [
    CommonModule,
    LocationModifyRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class LocationModifyModule { }
