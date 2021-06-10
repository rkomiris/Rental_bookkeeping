import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from "./auth.routing";
import { AuthComponent } from './auth.component';
import { MAT_DATE_LOCALE } from '@angular/material';
import { SubscriptionComponent } from './subscription/subscription.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material.module';


@NgModule({
  declarations: [AuthComponent],
  imports: [
    CommonModule,
    routing,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ]
})
export class AuthModule { }

