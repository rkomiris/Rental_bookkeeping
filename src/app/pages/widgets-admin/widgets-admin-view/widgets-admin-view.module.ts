
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { WidgetsAdminViewComponent } from './widgets-admin-view.component';
import { WidgetsAdminViewRoutingModule } from './widgets-admin-view.routing';
import { WidgetsAdminViewService } from './widgets-admin-view.service';
import { MAT_DATE_LOCALE } from '@angular/material';

@NgModule({
  declarations: [WidgetsAdminViewComponent],
  imports: [
    CommonModule,
    WidgetsAdminViewRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [WidgetsAdminViewService,

      { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    ]
})
export class WidgetsAdminViewModule { }
