
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequesttypeViewRoutingModule } from './requesttype-view-routing.module';
import { RequesttypeViewComponent } from './requesttype-view.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [RequesttypeViewComponent],
  imports: [
    CommonModule,
    RequesttypeViewRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class RequesttypeViewModule { }
