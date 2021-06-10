
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import {RequestScrconfigModifyComponent} from './request-scrconfig-modify.component';
import {ModifyRoutingModule} from './modify-routing.module';
@NgModule({
  declarations: [RequestScrconfigModifyComponent],
  imports: [
    CommonModule,
    ModifyRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class ModifyModuleModule { }
