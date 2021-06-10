import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneBookDetailsViewComponent } from './phone-book-details-view.component';
import { PhoneBookDetailsViewRoutingModule } from './phone-book-details-view-routing.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [PhoneBookDetailsViewComponent],
  imports: [
    CommonModule,
    PhoneBookDetailsViewRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class PhoneBookDetailsViewModule { }
