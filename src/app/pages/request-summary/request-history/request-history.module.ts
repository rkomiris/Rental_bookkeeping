import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { RequestHistoryComponent } from './request-history.component';
import { RequestHistoryService } from './request-history.service';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MAT_DATE_LOCALE } from '@angular/material';

@NgModule({
  // declarations: [RequestHistoryComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers:[RequestHistoryService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    ]
})
export class RequestHistoryModule { }
