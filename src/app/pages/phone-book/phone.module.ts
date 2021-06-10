import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneComponent } from './phone.component';
import { PhoneRoutingModule } from './phone-routing.module';
import { MaterialModule } from '../../shared/material.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { EmergencyContactComponent } from './emergency-contact/emergency-contact.component';

@NgModule({
  declarations: [PhoneComponent,EmergencyContactComponent],
  imports: [
    CommonModule,
    PhoneRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    Ng2SearchPipeModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  entryComponents:[EmergencyContactComponent]
})
export class PhoneModule { }
