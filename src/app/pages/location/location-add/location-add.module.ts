import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationAddRoutingModule } from './location-add-routing.module';
import { LocationAddComponent } from './location-add.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [LocationAddComponent],
  imports: [
    CommonModule,
    LocationAddRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class LocationAddModule {



 }

