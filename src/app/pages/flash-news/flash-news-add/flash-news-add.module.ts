import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlashNewsAddRoutingModule } from './flash-news-add-routing.module';
import { FlashNewsAddComponent } from './flash-news-add.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MAT_DATE_LOCALE } from '@angular/material';


@NgModule({
  declarations: [FlashNewsAddComponent],
  imports: [
    CommonModule,
    FlashNewsAddRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ]
})
export class FlashNewsAddModule { }
