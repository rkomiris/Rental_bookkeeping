import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResolverHistoryComponent } from './resolver-history.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ResolverHistoryService } from './resolver-history.service';
import { MAT_DATE_LOCALE } from '@angular/material';

@NgModule({
  //declarations: [ResolverHistoryComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [ResolverHistoryService,
      { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    ]
})
export class ResolverHistoryModule { }
