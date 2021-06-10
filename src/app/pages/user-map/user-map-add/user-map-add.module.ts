
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserMapAddComponent } from './user-map-add.component';

import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserMapAddRoutingModule } from './user-map-add-routing.module';
import { MAT_DATE_LOCALE } from '@angular/material';

@NgModule({
  declarations: [UserMapAddComponent],
  imports: [
    CommonModule,
    UserMapAddRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ]
})
export class UserMapAddModule { }
