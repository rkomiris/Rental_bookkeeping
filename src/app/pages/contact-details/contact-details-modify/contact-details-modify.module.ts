import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactDetailsModifyRoutingModule } from './contact-details-modify-routing.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ContactDetailsModifyComponent } from './contact-details-modify.component';

@NgModule({
  declarations: [ContactDetailsModifyComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ContactDetailsModifyRoutingModule

  ]
})
export class ContactDetailsModifyModule { }
