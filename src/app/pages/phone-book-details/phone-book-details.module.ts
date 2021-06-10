import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PhoneBookDetailsRoutingModule } from './phone-book-details-routing.module';
import { PhoneBookDetailsAddComponent } from './phone-book-details-add/phone-book-details-add.component';
import { PhoneBookDetailsViewComponent } from './phone-book-details-view/phone-book-details-view.component';
import { PhoneBookDetailsModifyComponent } from './phone-book-details-modify/phone-book-details-modify.component';
import { PhoneBookDetailsComponent } from './phone-book-details.component';
@NgModule({
  declarations: [PhoneBookDetailsComponent],
  imports: [
    CommonModule,
    PhoneBookDetailsRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class PhoneBookDetailsModule { }
