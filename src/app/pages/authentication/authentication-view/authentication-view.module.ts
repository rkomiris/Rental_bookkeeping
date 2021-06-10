import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationViewRoutingModule } from './authentication-view-routing.module';
import { AuthenticationViewComponent } from './authentication-view.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AuthenticationViewComponent],
  imports: [
    CommonModule,
    AuthenticationViewRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class AuthenticationViewModule { }
