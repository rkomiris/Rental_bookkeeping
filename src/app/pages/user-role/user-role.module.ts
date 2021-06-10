
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoleRoutingModule } from './user-role-routing.module';
import { UserRoleComponent } from './user-role.component';
import { MaterialModule } from '../../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MAT_DATE_LOCALE } from '@angular/material';
@NgModule({
  declarations: [UserRoleComponent],
  imports: [
    CommonModule,
    UserRoleRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ]
})
export class UserRoleModule { }
