import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeftNavRoutingModule } from './left-nav-routing.module';
import { LeftNavComponent } from './left-nav.component';
import { MaterialModule } from '../../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nModule } from '../i18n/i18n.module';
import { JsonApiService } from 'src/assets/api/json-api.service';
// import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [LeftNavComponent],
  imports: [
    CommonModule,
    LeftNavRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    I18nModule
    // SharedModule
  ],
  exports: [
    LeftNavComponent,
    I18nModule
  ],
  providers:[
  JsonApiService]
})
export class LeftNavModule { }
