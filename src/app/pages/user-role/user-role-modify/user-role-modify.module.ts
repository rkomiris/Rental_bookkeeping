
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoleModifyRoutingModule } from './user-role-modify-routing.module';
import { UserRoleModifyComponent } from './user-role-modify.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MAT_DATE_LOCALE } from '@angular/material';

@NgModule({
  declarations: [UserRoleModifyComponent],
  imports: [
    CommonModule,
    UserRoleModifyRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ]
})
export class UserRoleModifyModule { }
