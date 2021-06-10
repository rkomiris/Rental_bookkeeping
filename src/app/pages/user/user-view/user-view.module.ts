
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserViewRoutingModule } from './user-view-routing.module';
import { UserViewComponent } from './user-view.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [UserViewComponent],
  imports: [
    CommonModule,
    UserViewRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class UserViewModule { }
