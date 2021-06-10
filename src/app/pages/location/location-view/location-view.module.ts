import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationViewRoutingModule } from './location-view-routing.module';
import { LocationViewComponent } from './location-view.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [LocationViewComponent],
  imports: [
    CommonModule,
    LocationViewRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class LocationViewModule { }
