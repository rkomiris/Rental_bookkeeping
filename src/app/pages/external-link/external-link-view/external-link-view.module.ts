import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExternalLinkViewRoutingModule } from './external-link-view-routing.module';
import { ExternalLinkViewComponent } from './external-link-view.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ExternalLinkViewComponent],
  imports: [
    CommonModule,
    ExternalLinkViewRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class ExternalLinkViewModule { }

