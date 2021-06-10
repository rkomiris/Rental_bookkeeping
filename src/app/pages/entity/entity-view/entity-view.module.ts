import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { EntityViewRoutingModule } from './entity-view-routing.module';
import { EntityViewComponent } from './entity-view.component';

@NgModule({
  declarations: [EntityViewComponent],
  imports: [
    CommonModule,
    EntityViewRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class EntityViewModule { }
