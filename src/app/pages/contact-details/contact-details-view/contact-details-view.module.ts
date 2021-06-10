import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ContactDetailsViewRoutingModule } from './contact-details-view-routing.module';
import { ContactDetailsViewComponent } from './contact-details-view.component';

@NgModule({
  declarations: [ContactDetailsViewComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ContactDetailsViewRoutingModule
  ]
})
export class ContactDetailsViewModule { }
