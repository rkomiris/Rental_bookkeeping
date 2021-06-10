import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationAddRoutingModule } from './authentication-add-routing.module';
import { AuthenticationAddComponent } from './authentication-add.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AuthenticationAddComponent],
  imports: [
    CommonModule,
    AuthenticationAddRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class AuthenticationAddModule { }
