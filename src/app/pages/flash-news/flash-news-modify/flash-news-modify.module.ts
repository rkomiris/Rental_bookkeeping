import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlashNewsModifyRoutingModule } from './flash-news-modify-routing.module';
import { FlashNewsModifyComponent } from './flash-news-modify.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MAT_DATE_LOCALE } from '@angular/material';


@NgModule({
  declarations: [FlashNewsModifyComponent],
  imports: [
    CommonModule,
    FlashNewsModifyRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ]
})
export class FlashNewsModifyModule { }
