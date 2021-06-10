import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlashNewsRoutingModule } from './flash-news-routing.module';
import { FlashNewsComponent } from './flash-news.component';
import { MaterialModule } from '../../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MAT_DATE_LOCALE } from '@angular/material';

@NgModule({
  declarations: [FlashNewsComponent],
  imports: [
    CommonModule,
    FlashNewsRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ]
})
export class FlashNewsModule { }

