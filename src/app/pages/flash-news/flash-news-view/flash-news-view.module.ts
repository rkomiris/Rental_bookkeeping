import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlashNewsViewRoutingModule } from './flash-news-view-routing.module';
import { FlashNewsViewComponent } from './flash-news-view.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MAT_DATE_LOCALE } from '@angular/material';


@NgModule({
  declarations: [FlashNewsViewComponent],
  imports: [
    CommonModule,
    FlashNewsViewRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ]
})
export class FlashNewsViewModule { }
