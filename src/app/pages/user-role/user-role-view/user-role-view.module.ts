
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoleViewRoutingModule } from './user-role-view-routing.module';
import { UserRoleViewComponent } from './user-role-view.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MAT_DATE_LOCALE } from '@angular/material';

@NgModule({
  declarations: [UserRoleViewComponent],
  imports: [
    CommonModule,
    UserRoleViewRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ]
})
export class UserRoleViewModule { }
