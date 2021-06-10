
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { WidgetsViewComponent } from './widgets-view.component';
import { WidgetsViewRoutingModule } from './widgets-view.routing';
import { WidgetsViewService } from './widgets-view.service';
import { MAT_DATE_LOCALE } from '@angular/material';

@NgModule({
  declarations: [WidgetsViewComponent],
  imports: [
    CommonModule,
    WidgetsViewRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [WidgetsViewService,
   { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    ]
})
export class WidgetsViewModule { }
