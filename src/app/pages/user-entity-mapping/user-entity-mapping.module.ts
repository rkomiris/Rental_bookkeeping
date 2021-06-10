import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserEntityMappingRoutingModule } from './user-entity-mapping-routing.module';
import { UserEntityMappingComponent } from './user-entity-mapping.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserEntityMappingService } from './user-entity-mapping.service';

@NgModule({
  declarations: [UserEntityMappingComponent],
  imports: [
    CommonModule,
    UserEntityMappingRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [UserEntityMappingService]
})
export class UserEntityMappingModule { }
