import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestResolverViewComponent } from './request-resolver-view.component';
import { RequestResolverViewRoutingModule } from './request-resolver-view-routing.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MAT_DATE_LOCALE } from '@angular/material';

@NgModule({
  declarations: [RequestResolverViewComponent],
  imports: [
    CommonModule,
    RequestResolverViewRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ]
})
export class RequestResolverViewModule { }
