import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactDetailsComponent } from './contact-details.component';
import { LeftNavModule } from 'src/app/shared/left-nav/left-nav.module';
import { ContactDetailsRoutingModule } from './contact-details-routing.module';

@NgModule({
  declarations: [ContactDetailsComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    LeftNavModule,
    SharedModule,
    ContactDetailsRoutingModule
  ]
})
export class ContactDetailsModule { }
