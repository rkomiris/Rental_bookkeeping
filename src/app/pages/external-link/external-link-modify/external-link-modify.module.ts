import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExternalLinkModifyRoutingModule } from './external-link-modify-routing.module';
import { ExternalLinkModifyComponent } from './external-link-modify.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ExternalLinkModifyComponent],
  imports: [
    CommonModule,
    ExternalLinkModifyRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class ExternalLinkModifyModule { }

