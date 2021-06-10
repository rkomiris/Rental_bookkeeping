import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExternalLinkAddRoutingModule } from './external-link-add-routing.module';
import { ExternalLinkAddComponent } from './external-link-add.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ExternalLinkAddComponent],
  imports: [
    CommonModule,
    ExternalLinkAddRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class ExternalLinkAddModule { }

