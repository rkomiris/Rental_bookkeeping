import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { EntityAddRoutingModule } from './entity-add-routing.module';
import { EntityAddComponent } from './entity-add.component';

@NgModule({
  declarations: [EntityAddComponent],
  imports: [
    CommonModule,
    EntityAddRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class EntityAddModule { }
