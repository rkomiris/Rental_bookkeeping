
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserModifyRoutingModule } from './user-modify-routing.module';
import { UserModifyComponent } from './user-modify.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [UserModifyComponent],
  imports: [
    CommonModule,
    UserModifyRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class UserModifyModule { }
