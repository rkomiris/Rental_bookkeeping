import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ContactDetailsAddRoutingModule } from './contact-details-add-routing.module';
import { ContactDetailsAddComponent } from './contact-details-add.component';

@NgModule({
  declarations: [ContactDetailsAddComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ContactDetailsAddRoutingModule

  ]
})
export class ContactDetailsAddModule { }
