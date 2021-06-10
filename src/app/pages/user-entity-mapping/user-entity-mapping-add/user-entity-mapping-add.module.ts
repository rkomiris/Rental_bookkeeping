import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserEntityMappingAddRoutingModule } from './user-entity-mapping-add-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserEntityMappingAddComponent } from './user-entity-mapping-add.component';

@NgModule({
  declarations: [UserEntityMappingAddComponent],
  imports: [
    CommonModule,
    UserEntityMappingAddRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class UserEntityMappingAddModule { }
