import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExternalLinkRoutingModule } from './external-link-routing.module';
import { ExternalLinkComponent } from './external-link.component';
import { MaterialModule } from '../../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [ExternalLinkComponent],
  imports: [
    CommonModule,
    ExternalLinkRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class ExternalLinkModule { }

