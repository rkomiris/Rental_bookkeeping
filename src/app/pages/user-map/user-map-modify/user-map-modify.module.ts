
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserMapModifyComponent } from './user-map-modify.component';
import { UserMapModifyRoutingModule } from './user-map-modify-routing.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MAT_DATE_LOCALE } from '@angular/material';

@NgModule({
  declarations: [UserMapModifyComponent],
  imports: [
    CommonModule,
    UserMapModifyRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ]
})
export class UserMapModifyModule { }
