import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserEntityMappingViewRoutingModule } from './user-entity-mapping-view-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  UserEntityMappingViewComponent } from './user-entity-mapping-view.component';

@NgModule({
  declarations: [UserEntityMappingViewComponent],
  imports: [
    CommonModule,
    UserEntityMappingViewRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class UserEntityMappingViewModule { }
