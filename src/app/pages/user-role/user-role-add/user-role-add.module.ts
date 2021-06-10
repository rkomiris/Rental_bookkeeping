
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoleAddRoutingModule } from './user-role-add-routing.module';
import { UserRoleAddComponent } from './user-role-add.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MAT_DATE_LOCALE } from '@angular/material';

@NgModule({
  declarations: [UserRoleAddComponent],
  imports: [
    CommonModule,
    UserRoleAddRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ]
})
export class UserRoleAddModule { }
