import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationModifyRoutingModule } from './authentication-modify-routing.module';
import { AuthenticationModifyComponent } from './authentication-modify.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AuthenticationModifyComponent],
  imports: [
    CommonModule,
    AuthenticationModifyRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class AuthenticationModifyModule { }
