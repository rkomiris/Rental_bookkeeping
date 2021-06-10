import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneBookDetailsModifyComponent } from './phone-book-details-modify.component';
import { PhoneBookDetailsModifyRoutingModule } from './phone-book-details-modify-routing.module';
// import { PhoneBookDetailsAddRoutingModule } from './phone-book-details-add-routing.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [PhoneBookDetailsModifyComponent],
  imports: [
    CommonModule,
    PhoneBookDetailsModifyRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class PhoneBookDetailsModifyModule { }
