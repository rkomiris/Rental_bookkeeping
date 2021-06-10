import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestResolverRoutingModule } from './request-resolver-routing.module';
import { RequestResolverComponent } from './request-resolver.component';
import { MaterialModule } from '../../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { LeftNavModule } from 'src/app/shared/left-nav/left-nav.module';
import { ForwardRequestAddComponent } from './forward-request-add/forward-request-add.component';
import { MAT_DATE_LOCALE } from '@angular/material';
@NgModule({
  declarations: [RequestResolverComponent, ForwardRequestAddComponent],
  imports: [
    CommonModule,
    RequestResolverRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    LeftNavModule
  ],
  entryComponents: [ForwardRequestAddComponent],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ]
})
export class RequestResolverModule { }
