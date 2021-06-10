
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { WidgetsComponent } from './widgets.component';
import { WidgetsRoutingModule } from './widgets-routing.module';
import { WidgetsService } from './widgets.service';

@NgModule({
    declarations: [WidgetsComponent],
    imports: [
      CommonModule,
      WidgetsRoutingModule,
      MaterialModule,
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
    ],
    providers: [WidgetsService]
  })
  export class WidgetsModule { }
