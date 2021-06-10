
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import {RequestScrconfigViewComponent} from './request-scrconfig-view.component';
import {RequestScrconfigViewRoutingModule} from './request-scrconfig-view-routing.module';
@NgModule({
  declarations: [RequestScrconfigViewComponent],
  imports: [
    CommonModule,
    RequestScrconfigViewRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class RequestScrconfigViewModule { }
