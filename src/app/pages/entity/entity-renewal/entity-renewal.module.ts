import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { EntityRenewalComponent } from './entity-renewal.component';
import { EntityRenewalRoutingModule } from './entity-renewal-routing.module';

@NgModule({
  declarations: [EntityRenewalComponent],
  imports: [
    CommonModule,
    EntityRenewalRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class EntityRenewalModule { }
