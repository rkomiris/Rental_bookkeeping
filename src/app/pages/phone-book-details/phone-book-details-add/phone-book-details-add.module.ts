import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneBookDetailsAddComponent } from './phone-book-details-add.component';
import { PhoneBookDetailsAddRoutingModule } from './phone-book-details-add-routing.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [PhoneBookDetailsAddComponent],
  imports: [
    CommonModule,
    PhoneBookDetailsAddRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class PhoneBookDetailsAddModule { }
